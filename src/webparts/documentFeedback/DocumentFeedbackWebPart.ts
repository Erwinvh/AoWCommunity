import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './DocumentFeedbackWebPart.module.scss';

export interface ITriggerList {
  value: ITriggerListItem[]
}

export interface ITriggerListItem {
  TriggerID: string;
  Trigger: string;
}

export interface IGenreList {
  value: IGenreListItem[]
}

export interface IGenreListItem {
  ID: string;
  GenreID: string;
  Genre: string;
}
export interface ITagList {
  value: ITagListItem[]
}

export interface ITagListItem {
  TagID: string;
  Tag: string;
}

export interface IWritingList {
  value: IWritingListItem[]
}

export interface IWritingListItem {
  Title: string;
  Writingtitle: string;
  Owner: string;
  WorkType: string; //Collection or single
  Visibility: string;
  Writingtype: string; // Poetry, non-fiction, Script, fiction or other
  Writingstate: string; //finished, in review, rough draft
  Description: string;

  FirstPosted: Date;
  LastUpdated: Date;

  Views: number;
  FeedbackReceived: number;

  Triggers: string;
  Genres: string;
  Tags: string;
  Reference: string; //Collections-> singlesID & Singles -> versionID
}


export interface IDocumentList {
  value: IDocumentListItem[]
}

export interface IDocumentListItem {
  Title: string;
  DocumentID: string;
  ServerRedirectedEmbedUrl: string;
  ServerRedirectedEmbedUri: string;
}

export interface ICommentList {
  value: ICommentListItem[]
}

export interface ICommentListItem {
  Comment: string;
  Created: string;
  UserID: string;
}

export interface IQuestionList {
  value: IQuestionListItem[]
}

export interface IQuestionListItem {
  Title: string;
  Question: string;
}

export interface IAnswerList {
  value: IAnswerListItem[]
}

export interface IAnswerListItem {
  Title: string;
  QuestionID: string;
  Answer: string;
  UserID: string;
}

export interface IFormalList {
  value: IFormalListItem[]
}

export interface IFormalListItem {
  Title: string;
  FormalType: string;
  Content: string;
  FeedbackerID: string;
  created: string;
}

export interface IDocumentFeedbackWebPartProps {
}

import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import HTMLRenderer from './HTMLRenderer';

export default class DocumentFeedbackWebPart extends BaseClientSideWebPart<IDocumentFeedbackWebPartProps> {

  writingItems : IWritingListItem[];
  Selected: IWritingListItem;

  public render(): void {
    let HtmlRender = new HTMLRenderer();
    this.domElement.innerHTML = `<div class="${styles.maincontainer}" style="overflow-y:hidden;">`
     + HtmlRender.renderWritingContainer() 
     + HtmlRender.renderExploreContainer()
     + `</div>`
     +HtmlRender.renderMemberBar();
this._bindCommentSave();
this._bindFormalSave();
this._renderWritingsAsync();
//TODO: make the document type dynamic if necessary

this._renderDocumentsAsync();
this._renderQuestionsAsync();
this._renderFormalsAsync();
this._renderCommentsAsync();
//TODO: pull feedback inlines

this._renderAllFilters();
this._renderWritingIconsAsync();
  }

  private _bindCommentSave():void{
    this.domElement.querySelector('#CommentsInputSend')?.addEventListener('click', ()=>{
      this.addCommentItem();
    })
  }

  private _bindAnswerSave(QID: string):void{
    let ID: string = '#' + QID + 'InputSend';
    this.domElement.querySelector(ID)?.addEventListener('click', ()=>{
      this.addAnswerItem(QID);
    })
  }

  private _bindFormalSave():void{
    this.domElement.querySelector('#FormalInputSend')?.addEventListener('click', ()=>{
      this.addFormalItem();
    })
  }

private addCommentItem(){
  var Title = "CFID-T";
  var Comment =(<HTMLInputElement>document.getElementById("CommentsInputField")).value;
  //var Comment = "Live test default"
  var CommenterID = this.context.pageContext.user.displayName;
  var VersionID = "VID-1"
  const siteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Comments')/Items"
  const itemBody: any = {
    "Title": Title,
    "VersionID": VersionID,
    "UserID": CommenterID,
    "Comment": Comment
  }
  const spHttpClientOptions: ISPHttpClientOptions = {
    "body": JSON.stringify(itemBody)
  }
  this.context.spHttpClient.post(siteUrl, SPHttpClient.configurations.v1, spHttpClientOptions)
  .then((response: SPHttpClientResponse)=>{
    this._renderCommentsAsync();
    (<HTMLInputElement>document.getElementById("CommentsInputField")).value = "";
  });

}

private addAnswerItem(QID: string){
  var Title = "AID-T";
  let element: string = QID+ 'InputField';
  var Answer =(<HTMLInputElement>document.getElementById(element)).value;
  //var Comment = "Live test default"
  var CommenterID = this.context.pageContext.user.displayName;
  const siteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Answers')/Items"
  const itemBody: any = {
    "Title": Title,
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
  });

}

private addFormalItem(){
  var Title = "FFID-T";
  var Top = (<HTMLInputElement>document.getElementById("TopsInputField")).value;
  var Tip = (<HTMLInputElement>document.getElementById("TipsInputField")).value;
  var General = (<HTMLInputElement>document.getElementById("GeneralInputField")).value;
  var Nitpick = (<HTMLInputElement>document.getElementById("NitpicksInputField")).value;
  //var Comment = "Live test default"
  var CommenterID = this.context.pageContext.user.displayName;
  var VersionID = "VID-1"
  const siteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Formal Feedback')/Items"
  if(Top!=""){
  const itemTopBody: any = {
    "Title": Title,
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
    this._renderFormalsAsync(); 
  });
}

if(Tip!=""){
  const itemTipBody: any = {
    "Title": Title,
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
    this._renderFormalsAsync();
  });
}

if(General!=""){
  const itemGeneralBody: any = {
    "Title": Title,
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
    this._renderFormalsAsync();
  });
}

if(Nitpick!=""){
  const itemTipBody: any = {
    "Title": Title,
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
    this._renderFormalsAsync();
  });
}


}

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }


//TODO: Code to pull writing item based off of WritingID
private _renderWritingsAsync() {
  this._getWritingsListdata()
    .then((response) => {
      this._renderWritingsList(response.value);
    })
    .catch(() => { });
}

private _getWritingsListdata(): Promise<IWritingList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Writings')/items?$filter= Title eq 'WID-2' & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
private _renderWritingsList(items: IWritingListItem[]): void {
  let html: string = '';
    this.domElement.querySelector('#TitleContainer')!.innerHTML = items[0].Writingtitle;
    html += '<p>By: ' + items[0].Owner + '</p>';
    html += '<p>' + items[0].Description + '</p>';
    this.domElement.querySelector('#DescContainer')!.innerHTML = html;

}


private _renderDocumentsAsync() {
  this._getDocumentsListdata()
    .then((response) => {
      this._renderDocumentsList(response.value);
    })
    .catch(() => { });
}

private _getDocumentsListdata(): Promise<IDocumentList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('WritingDocuments')/items?$filter= DocumentID eq 'DID-2'`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
private _renderDocumentsList(items: IDocumentListItem[]): void {
  let html: string = '<iframe src= ';
  html+= items[0].ServerRedirectedEmbedUrl;
  html+= ' style="width:100%; height:50vh"> </iframe>';
  this.domElement.querySelector('#Documentcontainer')!.innerHTML = html;
}


//TODO: Code to pull feedback comments based off of VersionID
private _renderCommentsAsync() {
  this._getCommentsListdata()
    .then((response) => {
      this._renderCommentsList(response.value);
    })
    .catch(() => { });
}

private _getCommentsListdata(): Promise<ICommentList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Comments')/items?$filter= VersionID eq 'VID-1' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
  
private _renderCommentsList(items: ICommentListItem[]): void {
  let html: string = ``;
    items.forEach((item: ICommentListItem) => {
    html+=`<div style=" width:100%; margin: 5%; display: grid; grid-template-columns: 1fr 9fr;">`;
      html+=`<img src="${require('../../shared/assets/person.png')}"`;
      html+=`alt="" style="width: 100%; margin: 5%;">`;
    html+= `<div><p>`+ item.UserID+`</p>`;

    html+=`<br><p>`+item.Comment+`</p>`;
    html+=`<br><p>`+item.Created+`</p></div></div>`;
  });
  this.domElement.querySelector('#CommentsArea')!.innerHTML = html;
}

//TODO: Code to pull feedback comments based off of VersionID
private _renderQuestionsAsync() {
  this._getQuestionsListdata()
    .then((response) => {
      this._renderQuestionsList(response.value);
    })
    .catch(() => { });
}

private _getQuestionsListdata(): Promise<IQuestionList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Questions')/items?$filter= VersionID eq 'VID-1' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
  
private _renderQuestionsList(items: IQuestionListItem[]): void {
  let html: string = ``;
    items.forEach((item: IQuestionListItem) => {
    html+=`<button type="button" class="${styles.collapsible}" style="background-color: #e4341c;"
    onclick="
      if(document.getElementById('`+item.Title+`').style.display == 'none'){
        document.getElementById('`+item.Title+`').style.display = 'block';
      }else{
        document.getElementById('`+item.Title+`').style.display = 'none';
      }"
    >`+ item.Question +`</button>
    <div id="`+item.Title+`" class="${styles.content}" style=" display:none;">
    <div id="`+item.Title+`Container">
    `;
//TODO: pull the answers related to the question

html+=`</div>
  <div class="${styles.Answer}">
    <p>My answer:</p>
    <textarea id="`+item.Title+`InputField" type="text" style="margin-left: 5%;"></textarea>
    <button id="`+item.Title+`InputSend" style="float: right; margin-right: 10%;">Send</button>
  </div>
</div>`;
  });
  this.domElement.querySelector('#QAContainer')!.innerHTML = html;

  items.forEach((item: IQuestionListItem)=>{
    this._renderAnswersAsync(item.Title);
    this._bindAnswerSave(item.Title);
  });
}

private _renderAnswersAsync(Filter: string) {
  this._getAnswersListdata(Filter)
    .then((response) => {
      this._renderAnswersList(response.value, Filter);
    })
    .catch(() => { });
}

private _getAnswersListdata(Filter: string): Promise<IAnswerList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Answers')/items?$filter= QuestionID eq '`+Filter+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
  
private _renderAnswersList(items: IAnswerListItem[], Filter: string): void {
  let html: string = ``;
    items.forEach((item: IAnswerListItem) => {
    html+=`<div class="${styles.Answer}">
    <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
    <div>
      <p>`+ item.UserID+`:</p>
      <p style="margin-left: 5%;">`+ item.Answer+`</p>
    </div>
  </div>
    `;
  });
  let Container: string = '#'+Filter+'Container';
  this.domElement.querySelector(Container)!.innerHTML = html;
}

private _renderFormalsAsync() {
  this._getFormalListdata()
    .then((response) => {
      this._renderFormalList(response.value);
    })
    .catch(() => { });
}

private _getFormalListdata(): Promise<IFormalList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Formal feedback')/items?$filter= VersionID eq 'VID-1' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
  
private _renderFormalList(items: IFormalListItem[]): void {
  let htmlTips: string = ``;
  let htmlTops: string = ``;
  let htmlGeneral: string = ``;
  let htmlNitpicks: string = ``;
    items.forEach((item: IFormalListItem) => {
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

private _renderWritingIconsAsync() {
  this._getWritingiconsListdata()
    .then((response) => {
      this._renderWritingiconsList(response.value);
    })
    .catch(() => { });
}

private _getWritingiconsListdata(): Promise<IWritingList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Writings')/items? $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }
private _renderWritingiconsList(items: IWritingListItem[]): void {
  let html: string = '';
  this.writingItems = items;
  items.forEach((item: IWritingListItem) => {
    if (item.Visibility == "Public") {
      switch (item.Writingtype) {
        case "Fiction":
          html += `
          <div class="${styles.exploreitemf} ${styles.griditem} " id="${item.Title}">
          <img src="${require('../../shared/assets/fiction.png')}" class="${styles.exploreicon}">`;
          break;
        case "Non-fiction":
          html += `
          <div class="${styles.griditem} ${styles.exploreitemnf}" id="${item.Title}">
          <img src="${require('../../shared/assets/nonfiction.png')}" class="${styles.exploreicon}">`;
          break;
        case "Poetry":
          html += `
          <div class="${styles.griditem} ${styles.exploreitemp}" id="${item.Title}">
          <img src="${require('../../shared/assets/poetry.png')}" class="${styles.exploreicon}">`;
          break;
        case "Script":
          html += `
          <div class="${styles.griditem} ${styles.exploreitems}" id="${item.Title}">
          <img src="${require('../../shared/assets/script.png')}" class="${styles.exploreicon}">`;
          break;
        case "Other":
        default:
          html += `
          <div class="${styles.griditem} ${styles.exploreitemo}" id="${item.Title}">
          <img src="${require('../../shared/assets/otherwriting.png')}" class="${styles.exploreicon}">`;
          break;
      }
html+=`<div class="${styles.exploreitem}" style="border-radius: inherit;">
<div style="position:relative; width:100%; height:100%;">`;
      if (item.WorkType == "Collection") {
        html += `<img src="${require('../../shared/assets/doc.png')}" class="${styles.exploreBackground2}">`;
      } else {
        html += `<img src="${require('../../shared/assets/page.png')}" class="${styles.exploreBackground2}">`;
      }
      html+=`</div>`;
      if (item.Triggers != null) {
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
                  ${item.Writingtitle}<br>
                  By: <a href="account descirption.html" style="color: #000;">${item.Owner}</a>
                </p>
                <button  id="Detailsdrop"     data-ID="${item.Title}" data-desc="${item.Owner}"
                  style="border-radius: 50%; padding: 2%; cursor: pointer; text-align: center; color: black; background-color: white; float: right;"
                  onclick="
                      document.getElementById('WritingListContainer').style.height = '55%';
                      document.getElementById('DetailMenu').style.height = '40%';
                      document.getElementById('DetailsCloseButton').style.display = 'block';

                      var html = '<p></p>';
                      html+= '<h4>Details:</h4>';
                      html+= '<p></p>';
                      html+= '<div>';
                      html+= '<h4>Base information</h4>';
                      html+='<p>Title: ${item.Writingtitle}</p>';
                      html+='<p>Author: ${item.Owner}</p>';
                      html+='<p>post-date: ${item.FirstPosted}</p>';
                      html+='<p>writing type: ${item.Writingtype}</p>';
                      html+='<p>genres: </p>';
                      html+='<ul>';
                      html+='<li>${item.Genres}</li>';
                      html+='<li>TODO:list the genres dynamically</li>';
                      html+='</ul>';
                      html+='<p>state: ${item.Writingstate}</p>';

                      html+= '</div>';
                      html+= '<div>';
                      html+='<h4>Statistics</h4>';
                      html+='<p>Views: ${item.Views}</p>';
                      html+='<p>Feedback given: ${item.FeedbackReceived}</p>';
                
                      html+= '</div>';
                      html+= '<div>';
                      html+='<h4>Tags and Triggers</h4>';
                      html+='<h5>Tags</h5>';
                      html+='<ul>';
                      html+='<li>${item.Tags}</li>';
                      html+='<li>TODO:list the tags dynamically</li>';
                      html+='</ul>';

                      html+='<h5>Triggers</h5>';
                      html+='<ul>';
                      html+='<li>${item.Triggers}</li>';
                      html+='<li>TODO:list the triggers dynamically</li>';
                      html+='<li>Tigger3</li>';
                      html+='</ul>';
                      html+= '</div>';
                      document.getElementById('DetailMenuInfo').innerHTML = html;

                  ">i</button>
              </div>
            </div>
          </a>
        </div>
            `;
    }

  });

  if (this.domElement.querySelector('#WritingListContainer') != null) {
    this.domElement.querySelector('#WritingListContainer')!.innerHTML = html;
  };
  this.domElement.querySelectorAll('#Detailsdrop').forEach(button => {
    button.addEventListener('click', this.handleClick);

  }
    );

}

private handleClick(event:MouseEvent){
  if(event.target != null){
    const div = (event.target as HTMLElement).closest('button');
    if(div!=null){
      let id = div?.getAttribute("data-ID");
      if(id!= null){
        console.log(id + " : ID!");
        //this._renderDetailsAsync(id);
  /*if (
    this.domElement.querySelector('#BaseInfo') != null) {
    this.domElement.querySelector('#BaseInfo')!.innerHTML = html;
  };*/
   // let Divhtml = document.getElementById('#BaseInfo');
  //  if(Divhtml) Divhtml.innerHTML = html;
  //document.getElementById('BaseInfo')?.innerHTML;
        //this._renderBruteDetails();
    }
    }
  }


}

private _renderAllFilters() {
  this._renderGenreListAsync();
  this._renderTriggerListAsync();
  this._renderTagListAsync();
}

private _renderGenreListAsync(): void {
  this._getGenreListData()
    .then((response) => {
      this._renderGenreList(response.value);
    })
    .catch(() => { });
}

private _getGenreListData(): Promise<IGenreList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Genres')/items?$select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
}

private _renderGenreList(items: IGenreListItem[]): void {
  let html: string = '<h4>Genres:</h4>';
  html += `<form>`
    ;
  items.forEach((item: IGenreListItem) => {
    html += `
    <div class = "${styles.filter}">
    <input type="checkbox" id="Type1" name="Type1" value="Fiction">
          <label for="Type1">${item.Genre}</label><br>
          </div>`;
  });

  html += '</form>';
  if (this.domElement.querySelector('#GenreListContainer') != null) {
    this.domElement.querySelector('#GenreListContainer')!.innerHTML = html;
  };
}

private _renderTriggerListAsync(): void {
  this._getTriggerListData()
    .then((response) => {
      this._renderTriggerList(response.value);
    })
    .catch(() => { });
}

private _getTriggerListData(): Promise<ITriggerList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Triggers')/items?$select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {

      return response.json();
    })
    .catch(() => { return });
}

private _renderTriggerList(items: ITriggerListItem[]): void {
  let html: string = '<h4>Include triggers:</h4>';
  html += '<form>';
  items.forEach((item: ITriggerListItem) => {
    html += `
    <div class = "${styles.filter}">
    <input type="checkbox" id="Type1" name="Type1" value="Fiction">
          <label for="Type1">${item.Trigger}</label><br>
          </div>`;
  });

  html += '</form>';
  if (this.domElement.querySelector('#TriggerListContainer') != null) {
    this.domElement.querySelector('#TriggerListContainer')!.innerHTML = html;
  };
}

private _renderTagListAsync(): void {
  this._getTagListData()
    .then((response) => {
      this._renderTagList(response.value);
    })
    .catch(() => { });
}

private _getTagListData(): Promise<ITagList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Tags')/items?$select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
}

private _renderTagList(items: ITagListItem[]): void {
  let html: string = '<h4>Tags:</h4>';
  html += '<form>';
  items.forEach((item: ITagListItem) => {
    html += `
    <div class = "${styles.filter}">
    <input type="checkbox" id="Type1" name="Type1" value="Fiction">
          <label for="Type1">${item.Tag}</label><br>
          </div>`;
  });

  html += '</form>';
  if (this.domElement.querySelector('#TagListContainer') != null) {
    this.domElement.querySelector('#TagListContainer')!.innerHTML = html;
  };
}










}
