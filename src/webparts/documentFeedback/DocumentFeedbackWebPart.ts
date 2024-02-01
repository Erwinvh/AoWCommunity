import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './DocumentFeedbackWebPart.module.scss';

import * as Objects from '../../shared/Objects';

export interface IDocumentFeedbackWebPartProps {
}

import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import HTMLRenderer from './HTMLRenderer';
import SharedHTMLRender from '../../shared/SharedHTMLRenderer';

export default class DocumentFeedbackWebPart extends BaseClientSideWebPart<IDocumentFeedbackWebPartProps> {

  writingItems : Objects.IWritingListItem[];
  Selected: Objects.IWritingListItem;

  public render(): void {
    const HtmlRender = new HTMLRenderer();
    const sharedHTMLRender = new SharedHTMLRender();
    this.domElement.innerHTML = `<div class="${styles.maincontainer}" style="overflow-y:hidden;">`
     + HtmlRender.renderWritingContainer() 
     + HtmlRender.renderExploreContainer()
     + HtmlRender.RenderWritingpieceOverview("Collection")
     + HtmlRender.RenderWritingpieceOverview("Single")
     + `</div>`
     +sharedHTMLRender.renderMemberBar("Explore");

this._renderAllFilters();
this._renderWritingIconsAsync();
this._bindBackButtons();

  }

private _bindBackButtons(): void{
  this.domElement.querySelector('#DocumentBackButton')?.addEventListener('click', ()=>{
    (<HTMLElement>this.domElement.querySelector('#WritingOverviewContainer')).style.display = "none";
    (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "block";
  })

  this.domElement.querySelector('#CollectionBackButton')?.addEventListener('click', ()=>{
    (<HTMLElement>this.domElement.querySelector('#CollectionOverview')).style.display = "none";
    (<HTMLElement>this.domElement.querySelector('#ExploreContainer')).style.display = "grid";
  })


}

private _bindSingleBackButton(CID:string):void{
  if(CID===""||CID===null){
    const old_element = this.domElement.querySelector('#SingleBackButton');
    if(old_element&&old_element.parentNode){
      const new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
    }
    this.domElement.querySelector('#SingleBackButton')?.addEventListener('click', ()=>{
      (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "none";
      (<HTMLElement>this.domElement.querySelector('#ExploreContainer')).style.display = "grid";
    })
  }else{
    const old_element = this.domElement.querySelector('#SingleBackButton');
    if(old_element&&old_element.parentNode){
      const new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
    }
    this.domElement.querySelector('#SingleBackButton')?.addEventListener('click', ()=>{
      (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "none";
      (<HTMLElement>this.domElement.querySelector('#CollectionOverview')).style.display = "block";

    })
  }
}
  
private getAttachmentDocument(VID:string): void{
  this.getVersionInformation(VID).then((response)=>{
    let html: string = '<iframe src="';
    html+= response.value[0].AttachmentFiles[0].ServerRelativeUrl;
    html+= '#toolbar=0" style="width:100%; height:50vh"> <iframe>';
    this.domElement.querySelector('#Documentcontainer')!.innerHTML = html;
  }).catch((e)=>{
    console.log(e)
  })
  
}

private getVersionInformation(VID: string): Promise<Objects.IVersionList>{
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Versions')/items?$filter=Title eq '`+VID+`'&$select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
  .then((response)=>{
    return response.json();
  });
}

  private _PresetDocument(VID:string):void{
    this._bindCommentSave(VID);
    this._bindFormalSave(VID);
    this._renderWritingsAsync(VID);
    this.getAttachmentDocument(VID);
    //this._renderDocumentsAsync(VID);
    this._renderQuestionsAsync(VID);
    this._renderFormalsAsync(VID);
    this._renderCommentsAsync(VID);
    //TODO: pull feedback inlines
  }
  
  private _bindCommentSave(VID:string):void{
    this.domElement.querySelector('#CommentsInputSend')?.addEventListener('click', ()=>{
      this.addCommentItem(VID);
    })
  }

  private _bindAnswerSave(QID: string):void{
    const ID: string = '#' + QID + 'InputSend';
    this.domElement.querySelector(ID)?.addEventListener('click', ()=>{
      this.addAnswerItem(QID);
    })
  }
  private _bindFormalSave(VID:string):void{
    this.domElement.querySelector('#FormalInputSend')?.addEventListener('click', ()=>{
      this.addFormalItem(VID);
    })
  }

private addCommentItem(VID: string):void{
  this.getNextCFID().then((response)=>{
    const Comment =(<HTMLInputElement>document.getElementById("CommentsInputField")).value;
    const CommenterID = this.context.pageContext.user.displayName;
    const siteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Comments')/Items"
    const itemBody: any = {
      "Title": response,
      "VersionID": VID,
      "UserID": CommenterID,
      "Comment": Comment
    }
    const spHttpClientOptions: ISPHttpClientOptions = {
      "body": JSON.stringify(itemBody)
    }
    this.context.spHttpClient.post(siteUrl, SPHttpClient.configurations.v1, spHttpClientOptions)
    .then((response: SPHttpClientResponse)=>{
      this._renderCommentsAsync(VID);
      (<HTMLInputElement>document.getElementById("CommentsInputField")).value = "";
    }).catch((e)=>{console.log(e)});
  }).catch((e)=>{console.log(e)});
}
private addAnswerItem(QID: string):void{
  this.getNextAID().then((response)=>{
    const element: string = QID+ 'InputField';
    const Answer =(<HTMLInputElement>document.getElementById(element)).value;
    const CommenterID = this.context.pageContext.user.displayName;
    const siteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Answers')/Items"
    const itemBody: any = {
      "Title": response,
      "QuestionID": QID,
      "UserID": CommenterID,
      "Answer": Answer
    }
    const spHttpClientOptions: ISPHttpClientOptions = {
      "body": JSON.stringify(itemBody)
    }
    this.context.spHttpClient.post(siteUrl, SPHttpClient.configurations.v1, spHttpClientOptions)
    .then((response: SPHttpClientResponse)=>{
      this._renderAnswersAsync(QID);
      (<HTMLInputElement>document.getElementById(element)).value = "";
    }).catch((e)=>{console.log(e)});
  }).catch((e)=>{console.log(e)});
  

}

private addFormalItem(VID:string):void{
  const Top = (<HTMLInputElement>document.getElementById("TopsInputField")).value;
  const Tip = (<HTMLInputElement>document.getElementById("TipsInputField")).value;
  const General = (<HTMLInputElement>document.getElementById("GeneralInputField")).value;
  const Nitpick = (<HTMLInputElement>document.getElementById("NitpicksInputField")).value;
  const CommenterID = this.context.pageContext.user.displayName;
  const VersionID = VID
  const siteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Formal Feedback')/Items"
  if(Top!==""){
    this.getNextFFID().then((response)=>{
  const itemTopBody: any = {
    "Title": response,
    "VersionID": VersionID,
    "FeedbackerID": CommenterID,
    "Content": Top,
    "FormalType": "Tops"
  }
  const spHttpClientOptions: ISPHttpClientOptions = {
    "body": JSON.stringify(itemTopBody)
  }
  this.context.spHttpClient.post(siteUrl, SPHttpClient.configurations.v1, spHttpClientOptions)
  .then((response: SPHttpClientResponse)=>{
    (<HTMLInputElement>document.getElementById("TopsInputField")).value = "";
    this._renderFormalsAsync(VersionID); 
  }).catch((e)=>{console.log(e)});
}).catch((e)=>{console.log(e)});
}

if(Tip!==""){
  this.getNextFFID().then((response)=>{
  const itemTipBody: any = {
    "Title": response,
    "VersionID": VersionID,
    "FeedbackerID": CommenterID,
    "Content": Tip,
    "FormalType": "Tips"
  }
  const spHttpClientOptions: ISPHttpClientOptions = {
    "body": JSON.stringify(itemTipBody)
  }
  this.context.spHttpClient.post(siteUrl, SPHttpClient.configurations.v1, spHttpClientOptions)
  .then((response: SPHttpClientResponse)=>{
    (<HTMLInputElement>document.getElementById("TipsInputField")).value = "";
    this._renderFormalsAsync(VersionID);
  }).catch((e)=>{console.log(e)});
}).catch((e)=>{console.log(e)});
}

if(General!==""){
  this.getNextFFID().then((response)=>{
  const itemGeneralBody: any = {
    "Title": response,
    "VersionID": VersionID,
    "FeedbackerID": CommenterID,
    "Content": General,
    "FormalType": "General"
  }
  const spHttpClientOptions: ISPHttpClientOptions = {
    "body": JSON.stringify(itemGeneralBody)
  }
  this.context.spHttpClient.post(siteUrl, SPHttpClient.configurations.v1, spHttpClientOptions)  .then((response: SPHttpClientResponse)=>{
    (<HTMLInputElement>document.getElementById("GeneralInputField")).value = "";
    this._renderFormalsAsync(VersionID);
  }).catch((e)=>{console.log(e)});
}).catch((e)=>{console.log(e)});
}

if(Nitpick!==""){
  this.getNextFFID().then((response)=>{
    const itemTipBody: any = {
      "Title": response,
      "VersionID": VersionID,
      "FeedbackerID": CommenterID,
      "Content": Nitpick,
      "FormalType": "Nitpicks"
    }
    const spHttpClientOptions: ISPHttpClientOptions = {
      "body": JSON.stringify(itemTipBody)
    }
    this.context.spHttpClient.post(siteUrl, SPHttpClient.configurations.v1, spHttpClientOptions)  .then((response: SPHttpClientResponse)=>{
      (<HTMLInputElement>document.getElementById("NitpicksInputField")).value = "";
      this._renderFormalsAsync(VersionID);
    }).catch((e)=>{console.log(e)});
  }).catch((e)=>{console.log(e)});
}


}

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

private _renderWritingsAsync(VID: string):void {
  this._getWritingsListdata(VID)
    .then((response) => {
      this._renderWritingsList(response.value);
    })
    .catch((e) => {console.log(e)});
}

private _getWritingsListdata(VID:string): Promise<Objects.ISingleList> {
    return this.getSingleIDFromVersionID(VID).then((response)=>{
      return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Singles')/items?$filter=Title eq '`+response+`' & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
    }).catch(()=>{ return });
  }

  private getSingleIDFromVersionID(VID:string):Promise<string>{
    return this.getVersionIDList(VID).then((response)=>{
      return response.value[0].Title
    })
  }

  private getVersionIDList(VID:string):Promise<Objects.IVersionList>{
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Versions')/items?$filter=Title eq '`+VID+`' & $select=SingleID`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    }).catch((e)=>{console.log(e)});
  }

private _renderWritingsList(items: Objects.ISingleListItem[]): void {
  let html: string = '';
    this.domElement.querySelector('#TitleContainer')!.innerHTML = items[0].Title;
    html += '<p>By ' + items[0].AuthorID + '</p>';
    html += '<p>' + items[0].Description + '</p>';
    this.domElement.querySelector('#DescContainer')!.innerHTML = html;
}

private _renderCommentsAsync(VID:string):void {
  this._getCommentsListdata(VID)
    .then((response) => {
      this._renderCommentsList(response.value);
    })
    .catch((e)=>{console.log(e)})
}

private _getCommentsListdata(VID:string): Promise<Objects.ICommentList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Comments')/items?$filter= VersionID eq '`+VID+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
  
private _renderCommentsList(items: Objects.ICommentListItem[]): void {
  let html: string = ``;
    items.forEach((item: Objects.ICommentListItem) => {
    html+=`<div style=" width:100%; margin: 5%; display: grid; grid-template-columns: 1fr 9fr;">`;
      html+=`<img src="${require('../../shared/assets/person.png')}"`;
      html+=`alt="" style="width: 100%; margin: 5%;">`;
    html+= `<div><p>`+ item.UserID+`</p>`;

    html+=`<br><p>`+item.Comment+`</p>`;
    html+=`<br><p>`+item.Created+`</p></div></div>`;
  });
  this.domElement.querySelector('#CommentsArea')!.innerHTML = html;
}

private _renderQuestionsAsync(VID:string):void {
  this._getQuestionsListdata(VID)
    .then((response) => {
      this._renderQuestionsList(response.value);
    })
    .catch((e)=>{console.log(e)})
}

private _getQuestionsListdata(VID:string): Promise<Objects.IQuestionList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Questions')/items?$filter= VersionID eq '`+VID+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
  
private _renderQuestionsList(items: Objects.IQuestionListItem[]): void {
  let html: string = ``;
    items.forEach((item: Objects.IQuestionListItem) => {
    html+=`<button type="button" class="${styles.collapsible}" style="background-color: #e4341c;"
    onclick="
      if(document.getElementById('`+item.Title+`').style.display === 'none'){
        document.getElementById('`+item.Title+`').style.display = 'block';
      }else{
        document.getElementById('`+item.Title+`').style.display = 'none';
      }"
    >`+ item.Question +`</button>
    <div id="`+item.Title+`" class="${styles.content}" style=" display:none;">
    <div id="`+item.Title+`Container">
    `;

html+=`</div>
  <div class="${styles.Answer}">
    <p>My answer</p>
    <textarea id="`+item.Title+`InputField" type="text" style="margin-left: 5%; max-width:80%; width:80%; min-width:80%;"></textarea>
    <button id="`+item.Title+`InputSend" style="float: right; margin-right: 10%;">Send</button>
  </div>
</div>`;
  });
  this.domElement.querySelector('#QAContainer')!.innerHTML = html;

  items.forEach((item: Objects.IQuestionListItem)=>{
    this._renderAnswersAsync(item.Title);
    this._bindAnswerSave(item.Title);
  });
}

private _renderAnswersAsync(Filter: string):void {
  this._getAnswersListdata(Filter)
    .then((response) => {
      this._renderAnswersList(response.value, Filter);
    })
    .catch((e)=>{console.log(e)})
}

private _getAnswersListdata(Filter: string): Promise<Objects.IAnswerList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Answers')/items?$filter= QuestionID eq '`+Filter+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
  
private _renderAnswersList(items: Objects.IAnswerListItem[], Filter: string): void {
  let html: string = ``;
    items.forEach((item: Objects.IAnswerListItem) => {
    html+=`<div class="${styles.Answer}">
    <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
    <div>
      <p>`+ item.UserID+`</p>
      <p style="margin-left: 5%;">`+ item.Answer+`</p>
    </div>
  </div>
    `;
  });
  const Container: string = '#'+Filter+'Container';
  this.domElement.querySelector(Container)!.innerHTML = html;
}

private _renderFormalsAsync(VID:string):void {
  this._getFormalListdata(VID)
    .then((response) => {
      this._renderFormalList(response.value);
    })
    .catch((e)=>{console.log(e)})
}

private _getFormalListdata(VID:string): Promise<Objects.IFormalList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Formal feedback')/items?$filter= VersionID eq '`+VID+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
  
private _renderFormalList(items: Objects.IFormalListItem[]): void {
  let htmlTips: string = ``;
  let htmlTops: string = ``;
  let htmlGeneral: string = ``;
  let htmlNitpicks: string = ``;
    items.forEach((item: Objects.IFormalListItem) => {
      let addition: string = ``;
      addition+=`<div class="${styles.Answer}">
      <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
      <div>
        <p>`+ item.FeedbackerID+`</p>
        <br>
        <p>`+ item.Content+`</p>
      </div>
    </div>`;
      switch(item.FormalType) { 
        case "Tips": { 
           htmlTips+= addition;
           break; 
        } 
        case "Tops": { 
          htmlTops+= addition;
           break; 
        } 
       case "Nitpicks": { 
        htmlNitpicks+= addition;
        break; 
        } 
        case "General":
        default: { 
          htmlGeneral+= addition;
           break; 
        } 
     } 
  });
  this.domElement.querySelector(`#TipsContent`)!.innerHTML = htmlTips;
  this.domElement.querySelector(`#TopsContent`)!.innerHTML = htmlTops;
  this.domElement.querySelector(`#GeneralContent`)!.innerHTML = htmlGeneral;
  this.domElement.querySelector(`#NitpicksContent`)!.innerHTML = htmlNitpicks;
}

private _renderWritingIconsAsync():void {
  this._getWritingiconsListdata()
    .then((response) => {
      this._renderWritingiconsList(response.value);
    })
    .catch((e)=>{console.log(e)})
}

private _getWritingiconsListdata(): Promise<Objects.IWritingList> {
  //TODO: only request public writing
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Writings')/items?&filter=Visibility eq 'Public' $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
private _renderWritingiconsList(items: Objects.IWritingListItem[]): void {
  let html: string = '';
  this.writingItems = items;
  items.forEach((item: Objects.IWritingListItem) => {
    if (item.Visibility === "Public") {
      switch (item.Writingtype) {
        case "Fiction":
          html += `
          <div class="${styles.exploreitemf} ${styles.griditem} " id="${item.Title}" onclick="">
          <img src="${require('../../shared/assets/fiction.png')}" class="${styles.exploreicon}">`;
          break;
        case "Non-fiction":
          html += `
          <div class="${styles.griditem} ${styles.exploreitemnf}" id="${item.Title}" onclick="">
          <img src="${require('../../shared/assets/nonfiction.png')}" class="${styles.exploreicon}">`;
          break;
        case "Poetry":
          html += `
          <div class="${styles.griditem} ${styles.exploreitemp}" id="${item.Title}" onclick="">
          <img src="${require('../../shared/assets/poetry.png')}" class="${styles.exploreicon}">`;
          break;
        case "Script":
          html += `
          <div class="${styles.griditem} ${styles.exploreitems}" id="${item.Title}" onclick="">
          <img src="${require('../../shared/assets/script.png')}" class="${styles.exploreicon}">`;
          break;
        case "Other":
        default:
          html += `
          <div class="${styles.griditem} ${styles.exploreitemo}" id="${item.Title}" onclick="">
          <img src="${require('../../shared/assets/otherwriting.png')}" class="${styles.exploreicon}">`;
          break;
      }
html+=`<div class="${styles.exploreitem}" style="border-radius: inherit;">
<div style="position:relative; width:100%; height:100%;">`;
      if (item.WorkType === "Collection") {
        html += `<img src="${require('../../shared/assets/doc.png')}" class="${styles.exploreBackground2}">`;
      } else {
        html += `<img src="${require('../../shared/assets/page.png')}" class="${styles.exploreBackground2}">`;
      }
      html+=`</div>`;
      if (item.Triggers !== null) {
        html += `
        <p style="float: right; position: absolute; top: 5%; right: 5%; font-weight: bolder;">!</p>`;
      }
      html += `
              <div
                style="overflow: hidden; position: absolute; height: 30%; width: 100%; `;
      switch (item.Writingtype) {
        case "Fiction":
          html += `background-color: #0092d2;`;
          break;
        case "Non-fiction":
          html += `background-color: #e4341c;`;
          break;
        case "Poetry":
          html += `background-color: #77c700;`;
          break;
        case "Script":
          html += `background-color: #f0bd24;`;
          break;
        case "Other":
        default:
          html += `background-color: #931eb8;`;
          break;
      }


      html += `bottom: 0%; font-size: small;">
                <p style="float: left; width: 80%;">
                ${item.Writingtitle}
                  <br>
                  By <a href="account descirption.html" style="color: #000;">${item.Owner}</a>

                </p>
                <button  id="${item.Title}Detailsdrop"     data-ID="${item.Title}" data-desc="${item.Owner}"
                  style="border-radius: 50%; padding: 2%; cursor: pointer; text-align: center; color: black; background-color: white; float: right;"
                  onclick="
                      

                  ">i</button>
              </div>
            </div>
          </a>
        </div>
            `;
    }

  });

  if (this.domElement.querySelector('#WritingListContainer') !== null) {
    this.domElement.querySelector('#WritingListContainer')!.innerHTML = html;
  }
  items.forEach((item: Objects.IWritingListItem) => {
    this.handleOverviewClick(item.Title);
    this.handleDetailDropClick(item);
  });

}

private handleOverviewClick(id: string): void{

  this.domElement.querySelector("#"+id)?.addEventListener('click', ()=>{
    (<HTMLElement>this.domElement.querySelector('#ExploreContainer')).style.display = "none";
    this._renderWritingAsync(id);
  })

}

private handleDetailDropClick(item: Objects.IWritingListItem): void{

  this.domElement.querySelector("#"+item.Title+"Detailsdrop")?.addEventListener('click', (e)=>{
    e.stopPropagation();
    (<HTMLElement>this.domElement.querySelector('#WritingListContainer')).style.height = '55%';
    (<HTMLElement>this.domElement.querySelector('#DetailMenu')).style.height = '40%';
    (<HTMLElement>this.domElement.querySelector('#DetailsCloseButton')).style.display = 'block';

    const html:string = `
    <p></p>
    <h4>Details</h4>
    <p></p>
    <div>
      <h4>Base information</h4>
      <p>Title: ${item.Writingtitle}</p>
      <p>Author: ${item.Owner}</p>
      <p>post-date: ${item.FirstPosted}</p>
      <p>writing type: ${item.Writingtype}</p>
      <p>genres: </p>
      <ul>
        <li>${item.Genres}</li>
        <li>TODO:list the genres dynamically</li>
      </ul>
      <p>state: ${item.Writingstate}</p>
      </div>
      <div>
        <h4>Statistics</h4>
        <p>Views: ${item.Views}</p>
        <p>Feedback given: ${item.FeedbackReceived}</p>
      </div>
      <div>
        <h4>Tags and Triggers</h4>
        <h5>Tags</h5>
        <ul>
          <li>${item.Tags}</li>
          <li>TODO:list the tags dynamically</li>
        </ul>
        <h5>Triggers</h5>
        <ul>
          <li>${item.Triggers}</li>
          <li>TODO:list the triggers dynamically</li>
          <li>Tigger3</li>
        </ul>
    </div>`;

    (<HTMLElement>this.domElement.querySelector('#DetailMenuInfo'))!.innerHTML = html;

  })

}

private getNextAID(): Promise<string>{
  return this._getAnswerIDListdata().then((response)=>{
    let ID:string = "AID-1";
    if(response.value.length!==0){
      const NewestID = response.value[0].Title;
      const substring = NewestID.replace("AID-", "");
      let IDnumber = parseInt(substring);
      IDnumber++;
      ID = "AID-"+IDnumber;
      return ID;
    }else{
      return ID;
    }
  })
  }
  
  private _getAnswerIDListdata(): Promise<Objects.ICommentList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Answers')/items?$select=ID, Title&$orderby=ID desc&$top= 1`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
    }

    private getNextFFID(): Promise<string>{
      return this._getFormalIDListdata().then((response)=>{
        let ID:string = "FFID-1";
        if(response.value.length!==0){
          const NewestID = response.value[0].Title;
          const substring = NewestID.replace("FFID-", "");
          let IDnumber = parseInt(substring);
          IDnumber++;
          ID = "FFID-"+IDnumber;
          return ID;
        }else{
          return ID;
        }
      })
      }
      
      private _getFormalIDListdata(): Promise<Objects.ICommentList> {
        return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Formal feedback')/items?$select=ID, Title&$orderby=ID desc&$top= 1`, SPHttpClient.configurations.v1)
          .then((response: SPHttpClientResponse) => {
            return response.json();
          })
          .catch(() => { return });
        }

private getNextCFID(): Promise<string>{
return this._getCommentIDListdata().then((response)=>{
  let ID:string = "CFID-1";
  if(response.value.length!==0){
    const NewestID = response.value[0].Title;
    const substring = NewestID.replace("CFID-", "");
    let IDnumber = parseInt(substring);
    IDnumber++;
    ID = "CFID-"+IDnumber;
    return ID;
  }else{
    return ID;
  }
})
}

private _getCommentIDListdata(): Promise<Objects.ICommentList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Comments')/items?$select=ID, Title&$orderby=ID desc&$top= 1`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }

private _renderAllFilters():void {
  this._renderGenreListAsync();
  this._renderTriggerListAsync();
  this._renderTagListAsync();
}

private _renderGenreListAsync(): void {
  this._getGenreListData()
    .then((response) => {
      this._renderGenreList(response.value);
    })
    .catch((e)=>{console.log(e)})
}

private _getGenreListData(): Promise<Objects.IGenreList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Genres')/items?$select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
}

private _renderGenreList(items: Objects.IGenreListItem[]): void {
  let html: string = '';
  items.forEach((item: Objects.IGenreListItem) => {
    html += `
    <input type="checkbox" id="Type1" name="Type1" value="Fiction">
          <label for="Type1">${item.Genre}</label><div class="${styles.tooltip}">?<span class="${styles.tooltiptext}">${item.GenreDescription}</span></div><br>`;
  });

  if (this.domElement.querySelector('#GenreListContainer') !== null) {
    this.domElement.querySelector('#GenreListContainer')!.innerHTML = html;
  }
}

private _renderTriggerListAsync(): void {
  this._getTriggerListData()
    .then((response) => {
      this._renderTriggerList(response.value);
    })
    .catch((e)=>{console.log(e)})
}

private _getTriggerListData(): Promise<Objects.ITriggerList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Triggers')/items?$select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {

      return response.json();
    })
    .catch(() => { return });
}

private _renderTriggerList(items: Objects.ITriggerListItem[]): void {
  let html: string = '';
  items.forEach((item: Objects.ITriggerListItem) => {
    html += `
    <input type="checkbox" id="Type1" name="Type1" value="Fiction">
          <label for="Type1">${item.Trigger}</label><div class="${styles.tooltip}">?<span class="${styles.tooltiptext}">${item.Triggerdescription}</span></div><br>`;
  });
  if (this.domElement.querySelector('#TriggerListContainer') !== null) {
    this.domElement.querySelector('#TriggerListContainer')!.innerHTML = html;
  }
}

private _renderTagListAsync(): void {
  this._getTagListData()
    .then((response) => {
      this._renderTagList(response.value);
    })
    .catch((e)=>{console.log(e)})
}

private _getTagListData(): Promise<Objects.ITagList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Tags')/items?$select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
}

private _renderTagList(items: Objects.ITagListItem[]): void {
  let html: string = '';
  html += '';
  items.forEach((item: Objects.ITagListItem) => {
    html += `
    <input type="checkbox" id="Type1" name="Type1" value="Fiction">
          <label for="Type1">${item.Tag}</label><div class="${styles.tooltip}">?<span class="${styles.tooltiptext}">${item.Tagdescription}</span></div><br>`;
  });
  if (this.domElement.querySelector('#TagListContainer') !== null) {
    this.domElement.querySelector('#TagListContainer')!.innerHTML = html;
  }
}

private _renderWritingAsync(WID: string):void {
  this._getWritingListdata(WID)
    .then((response) => {
      this._renderWriting(response.value);
    })
    .catch((e)=>{console.log(e)})
}

private _getWritingListdata(WID: string): Promise<Objects.IWritingList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Writings')/items?$filter= Title eq '`+WID+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
private _renderWriting(items: Objects.IWritingListItem[]): void {
  const item = items[0];

  if(item.WorkType === "Collection"){

    (<HTMLElement>this.domElement.querySelector('#CollectionOverview')).style.display = "block";

    (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "none";
    this.domElement.querySelector('#CollectionOverviewDesc')!.innerHTML = item.Description;
  this.domElement.querySelector('#CollectionTitleField')!.innerHTML = item.Writingtitle;

  this.domElement.querySelector('#CollectionOwnerField')!.innerHTML = item.Owner;
  this.domElement.querySelector('#CollectionViewField')!.innerHTML = item.Views.toString();

  this.domElement.querySelector('#CollectionFirstVersionDateField')!.innerHTML = ""+item.FirstPosted;

  this.domElement.querySelector('#CollectionLastUpdateField')!.innerHTML = ""+item.LastUpdated;

  this.domElement.querySelector('#CollectionFeedbackersField')!.innerHTML = item.FeedbackReceived.toString();
  this._renderCollectionAsync(item.Reference);
  //TODO: set genres in a nice fashion
  this.domElement.querySelector('#CollectionGenreField')!.innerHTML = item.Genres;
  //TODO: Set triggers in a nice fashion
  this.domElement.querySelector('#CollectionTriggersField')!.innerHTML = item.Triggers;
  //TODO: set tags in a nice fashion

  this.domElement.querySelector('#CollectionTagsField')!.innerHTML = item.Tags;
  this.domElement.querySelector('#CollectionSubdivisionTitle')!.innerHTML = "Chapters/Components";

  this.domElement.querySelector('#latestSingleRedirectButton')!.innerHTML = "Go to latest latest chapter/Component &rarr";

  }else{
    (<HTMLElement>this.domElement.querySelector('#CollectionOverview')).style.display = "none";
    (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "block";
    this.domElement.querySelector('#SingleOverviewDesc')!.innerHTML = item.Description;

    this.domElement.querySelector('#SingleViewField')!.innerHTML = item.Views.toString();
    this.domElement.querySelector('#SingleLastUpdateField')!.innerHTML = ""+item.LastUpdated;
    this.domElement.querySelector('#SingleFeedbackersField')!.innerHTML = item.FeedbackReceived.toString();

    this._renderSingleAsync(item.Reference);
    this.domElement.querySelector('#latestVersionRedirectButton')!.innerHTML = "Go to latest version &rarr";

  }

}

private _renderCollectionAsync(CID: string):void {
  this._getCollectionListdata(CID)
    .then((response) => {
      this._renderCollection(response.value);
    })
    .catch((e)=>{console.log(e)})
}

private _getCollectionListdata(CID: string): Promise<Objects.ICollectionList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Collections')/items?$filter= CollectionID eq '`+CID+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
private _renderCollection(items: Objects.ICollectionListItem[]): void {
  const item = items[0];
  this.domElement.querySelector('#CollectionTitleField')!.innerHTML = item.CollectionTitle;
  this._renderSinglesAsync(item.Title);
}

private _renderSinglesAsync(CID: string):void {
  this._getSinglesListdata(CID)
    .then((response) => {
      this._renderSingles(response.value);
    })
    .catch((e)=>{console.log(e)})
}

private _getSinglesListdata(CID: string): Promise<Objects.ISingleList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Singles')/items?$filter= CollectionID eq '`+CID+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
private _renderSingles(items: Objects.ISingleListItem[]): void {
  let html = `
  <tr>
    <th>Chapter/component</th>
    <th>Date</th>
    <th>Link</th>
  </tr>`;
  items.forEach((item: Objects.ISingleListItem)=>{
    //TODO: have the created date be a bit better looking
    html+=`
    <tr>
      <td>`+item.SingleTitle+`</td>
      <td>`+item.Created+`</td>
      <td> <button id="`+item.Title+`">To Chapter&rarr;</button></td>
    </tr>`;
  });
  this.domElement.querySelector('#CollectionSubdivisionTable')!.innerHTML = html;
  items.forEach((item: Objects.ISingleListItem)=>{
    this._bindSingleButtons(item.Title);
  })
  this._bindLatestSingle(items[items.length-1].Title);
}

private _bindSingleButtons(SID: string):void{
  this.domElement.querySelector('#'+SID)?.addEventListener('click', ()=>{
    (<HTMLElement>this.domElement.querySelector('#CollectionOverview')).style.display = "none";
    (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "block";
    this._renderSingleAsync(SID)
  })
  
}

private _bindLatestSingle(SID:string):void{
  this.domElement.querySelector('#latestSingleRedirectButton')?.addEventListener('click', ()=>{
    (<HTMLElement>this.domElement.querySelector('#CollectionOverview')).style.display = "none";
    (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "block";
    this._renderSingleAsync(SID)
  })
}

private _renderSingleAsync(SID: string):void {
  this._getSingleListdata(SID)
    .then((response) => {
      this._renderSingle(response.value);
    })
    .catch((e)=>{console.log(e)})
}

private _getSingleListdata(SID: string): Promise<Objects.ISingleList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Singles')/items?$filter= Title eq '`+SID+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
private _renderSingle(items: Objects.ISingleListItem[]): void {
  const item = items[0];

  this.domElement.querySelector('#SingleTitleField')!.innerHTML = item.SingleTitle;

  this.domElement.querySelector('#SingleOwnerField')!.innerHTML = item.AuthorID;
  //this.domElement.querySelector('#SingleViewField')!.innerHTML = item.Views.toString();
  this.domElement.querySelector('#SingleFirstVersionDateField')!.innerHTML = ""+item.Created;
  /*this.domElement.querySelector('#SingleLastUpdateField')!.innerHTML = ""+item.LastUpdated;
  this.domElement.querySelector('#SingleFeedbackersField')!.innerHTML = item.FeedbackReceived.toString();
  //TODO: set genres in a nice fashion
  this.domElement.querySelector('#SingleGenreField')!.innerHTML = item.Genres;
  //TODO: Set triggers in a nice fashion
  this.domElement.querySelector('#SingleTriggersField')!.innerHTML = item.Triggers;
  //TODO: set tags in a nice fashion
  this.domElement.querySelector('#SingleTagsField')!.innerHTML = item.Tags;*/
  this.domElement.querySelector('#SingleSubdivisionTitle')!.innerHTML = "Versions";

  this._renderVersionsAsync(item.Title);
  this.domElement.querySelector('#latestVersionRedirectButton')!.innerHTML = "Go to latest version &rarr";
  this._bindSingleBackButton(item.CollectionID);
}

private _renderVersionsAsync(SID: string):void {
  this._getVersionsListdata(SID)
    .then((response) => {
      this._renderVersions(response.value);
    })
    .catch((e)=>{console.log(e)})
}

private _getVersionsListdata(SID: string): Promise<Objects.IVersionList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Versions')/items?$filter= SingleID eq '`+SID+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
private _renderVersions(items: Objects.IVersionListItem[]): void {
  let html = `
  <tr>
    <th>Version</th>
    <th>Date</th>
    <th>Link</th>
  </tr>`;
  items.forEach((item: Objects.IVersionListItem)=>{
    //TODO: have the created date be a bit better looking
    html+=`
    <tr>
      <td>`+item.VersionName+`</td>
      <td>`+item.Created+`</td>
      <td> <button id="`+item.Title+`">To Version&rarr;</button></td>
    </tr>`;
  });
  this.domElement.querySelector('#SingleSubdivisionTable')!.innerHTML = html;
  items.forEach((item: Objects.IVersionListItem)=>{
    this.bindVersionButton(item.Title)
  });
  this._bindLatestVersion(items[items.length-1].Title);
}

private bindVersionButton(VID: string):void{
  this.domElement.querySelector('#'+VID)?.addEventListener('click', ()=>{
    this._openDocumentView(VID);
  })
}

private _bindLatestVersion(VID:string):void{
  this.domElement.querySelector('#latestVersionRedirectButton')?.addEventListener('click', ()=>{
    this._openDocumentView(VID);
  })
}

private _openDocumentView(VID: string):void{
    (<HTMLElement> this.domElement.querySelector('#SingleOverview')).style.display = "none";
    (<HTMLElement> this.domElement.querySelector('#WritingOverviewContainer')).style.display = "block";
    this._PresetDocument(VID);
}

}
