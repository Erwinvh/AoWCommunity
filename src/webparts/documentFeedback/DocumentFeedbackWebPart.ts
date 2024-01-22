import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './DocumentFeedbackWebPart.module.scss';

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

  First_placed: Date;
  Last_update: Date;

  Views: number;
  Feedback_received: number;

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
  public render(): void {
    let HtmlRender = new HTMLRenderer();
    this.domElement.innerHTML = `<div class="${styles.maincontainer}" style="overflow-y:hidden;">`
     + HtmlRender.renderWritingContainer() 
     + `</div>`;
this._bindCommentSave();
this._bindFormalSave();
this._renderWritingsAsync();
//TODO: make the document type dynamic if necessary
this._renderDocumentsAsync();
this._renderQuestionsAsync();

this._renderCommentsAsync();
//TODO: pull feedback inlines

this._renderFormalsAsync();
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


}
