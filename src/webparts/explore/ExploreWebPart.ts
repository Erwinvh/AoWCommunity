import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './ExploreWebPart.module.scss';
import * as Objects from '../../shared/Objects';
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import HTMLRenderer from './HTMLRenderer';
import SharedHTMLRender from '../../shared/SharedHTMLRenderer';


//Exports:
export interface IExploreWebPartProps {
}

export default class ExploreWebPart extends BaseClientSideWebPart<IExploreWebPartProps> {

  writingItems: Objects.IWritingListItem[];
  Selected: Objects.IWritingListItem;
  OtherFeedbackVisibility: boolean = true;

  //Base SPFX method, no need to touch it
  protected onInit(): Promise<void> {
    return super.onInit();
  }

  //Base SPFX method, no need to touch it
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  //Render method to construct the explore webpart, this method is automatically called when the webpart is inserted into a web-page. 
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method is called on a new webpart for the explore page.
  public render(): void {
    const HtmlRender = new HTMLRenderer();
    const sharedHTMLRender = new SharedHTMLRender();
    this.domElement.innerHTML = `<div class="${styles.maincontainer}" style="overflow-y:hidden;">`
      + HtmlRender.renderWritingContainer()
      + HtmlRender.renderExploreContainer()
      + HtmlRender.RenderWritingpieceOverview("Collection")
      + HtmlRender.RenderWritingpieceOverview("Single")
      + `</div>`
      + sharedHTMLRender.renderMemberBar("Explore");
    this._renderAllFilters();
    this._renderWritingIconsAsync();
    this._bindBackButtons();
  }

  //Button binding method to bind the two back buttons for the collection overview and the document view.
  //This method allows the buttons to return the user to the correct views: 
  //Collection overview goes to Explore view and Document view goes to Writing overview.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should only be called once after the buttons have been added to the inner html render.
  private _bindBackButtons(): void {
    this.domElement.querySelector('#DocumentBackButton')?.addEventListener('click', () => {
      (<HTMLElement>this.domElement.querySelector('#WritingOverviewContainer')).style.display = "none";
      (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "block";
    })
    this.domElement.querySelector('#CollectionBackButton')?.addEventListener('click', () => {
      (<HTMLElement>this.domElement.querySelector('#CollectionOverview')).style.display = "none";
      (<HTMLElement>this.domElement.querySelector('#ExploreContainer')).style.display = "grid";
    })
  }

  //Button binding method to bind the Single overview back button.
  //This method allows the back button to know whether it should return to a Collection overview or the Explore view.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should only be called once after the buttons have been added to the inner html render.
  private _bindSingleBackButton(CID: string): void {
    if (CID === "" || CID === null) {
      const old_element = this.domElement.querySelector('#SingleBackButton');
      if (old_element && old_element.parentNode) {
        const new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
      }
      this.domElement.querySelector('#SingleBackButton')?.addEventListener('click', () => {
        (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "none";
        (<HTMLElement>this.domElement.querySelector('#ExploreContainer')).style.display = "grid";
      })
    } else {
      const old_element = this.domElement.querySelector('#SingleBackButton');
      if (old_element && old_element.parentNode) {
        const new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
      }
      this.domElement.querySelector('#SingleBackButton')?.addEventListener('click', () => {
        (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "none";
        (<HTMLElement>this.domElement.querySelector('#CollectionOverview')).style.display = "block";
      })
    }
  }

  //Get method for the document to insert it into the document view.
  //This method allows the user to see a pdf file in the document reading view
  // - Parameter: VID: string, this is the Version ID of the writing
  // - Returns:   Void
  // - Example:   This method should only be called once after the documentcontainer has been added to the inner html render.
  private getAttachmentDocument(VID: string): void {
    this.getVersionInformation(VID).then((response) => {
      let html: string = '<iframe src="';
      html += response.value[0].AttachmentFiles[0].ServerRelativeUrl;
      html += '#toolbar=0" style="width:100%; height:50vh"> <iframe>';
      this.domElement.querySelector('#Documentcontainer')!.innerHTML = html;
    }).catch((e) => {
      console.log(e)
    })
  }

  //Get method for the version information based off of the VersionID that was given as the parameter.
  // - Parameter: VID: string, this is the Version ID of the writing
  // - Returns:   Promise of a IVersionList, this will contain the information of a version
  // - Example:   Can be use to get the attached document or to find the related Single ID. 
  //              return getVersionInformation("VID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private getVersionInformation(VID: string): Promise<Objects.IVersionList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Versions')/items?$filter=Title eq '` + VID + `'&$select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
      .then((response) => {
        return response.json();
      });
  }

  //Preset method for the document, this method is a collection of bind, get and render methods groeped together for ease of coding.
  // - Parameter: VID: string, this is the Version ID of the writing
  // - Returns:   Void
  // - Example:   This method should only when a change in document/version has been made or if a reload is necessary.
  private _PresetDocument(VID: string): void {
    this._bindCommentSave(VID);
    this._bindFormalSave(VID);
    this._renderDocumentDescriptionAsync(VID);
    this.getAttachmentDocument(VID);
    this._renderFeedback(VID);
  }

  //Render method for the feedback in the document feedback view.
  //This method allows the user to see the given feedback on a document based off of the versionID and the feedback settings
  // - Parameter: VID: string, this is the Version ID of the writing
  // - Returns:   Void
  // - Example:   This method should only when a change in document/version has been made or if a reload is necessary.
  // - TODO:      The feedback settings do not seem to fully be functional.
  private _renderFeedback(VID: string): void {
    this.getFeedbackSettings(VID).then((response) => {
      const settings = response.value[0]
      this.OtherFeedbackVisibility = settings.AllowVisibleFeedback;
      if (settings.AllowAllFeedback) {
        if (settings.AllowComments) {
          this._renderCommentsAsync(VID);
        }
        if (settings.AllowFormalFeedback) {
          this._renderFormalsAsync(VID);
        }
        if (settings.AllowQuestions) {
          this._renderQuestionsAsync(VID);
        }
        if (settings.AllowInline) {
          //TODO: pull feedback inlines
        }
      }
    })
  }

  //Get method for a versions feedbacksettings based off of the VersionID that was given as the parameter.
  // - Parameter: VID: string, this is the Version ID of the writing.
  // - Returns:   Promise of a IFeedbackSettingsList, this will contain the information of a versions feedback settings.
  // - Example:   Can be use to get the feedback settings from a Version. 
  //              return getFeedbackSettings("VID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private getFeedbackSettings(VID: string): Promise<Objects.IFeedbackSettingsList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('FeedbackSettings')/items?$filter=VersionID eq '` + VID + `'`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Button binding method to bind the save button for the comments feedback area.
  //This method allows the user to save a comment to this version.
  // - Parameter: VID: string, this is the Version ID of the writing
  // - Returns:   Void
  // - Example:   This method should only be called once after the comment save button has been added to the inner html render.
  private _bindCommentSave(VID: string): void {
    this.domElement.querySelector('#CommentsInputSend')?.addEventListener('click', () => {
      this.addCommentItem(VID);
    })
  }

  //Button binding method to bind the save button for the Question Answer feedback area.
  //This method allows the user to save a comment to this version.
  //This method gets called for every Question on a version as it 
  // - Parameter: QID: string, this is the Question ID of the question being answered.
  // - Returns:   Void
  // - Example:   This method should only be called once after the Question Answer save button has been added to the inner html render.
  private _bindAnswerSave(QID: string): void {
    const ID: string = '#' + QID + 'InputSend';
    this.domElement.querySelector(ID)?.addEventListener('click', () => {
      this.addAnswerItem(QID);
    })
  }

  //Button binding method to bind the save button for the formal feedback area.
  //This method allows the user to save a formal feedback form to this version.
  // - Parameter: VID: string, this is the Version ID of the writing
  // - Returns:   Void
  // - Example:   This method should only be called once after the formal feedback save button has been added to the inner html render.
  private _bindFormalSave(VID: string): void {
    this.domElement.querySelector('#FormalInputSend')?.addEventListener('click', () => {
      this.addFormalItem(VID);
    })
  }

  //Post/Add method for a Comment about a specific version.
  // - Parameter: VID: string, this is the Version ID of the writing.
  // - Returns:   Void
  // - Example:   follows the binding of the comment save button. 
  private addCommentItem(VID: string): void {

    //Find the next Comment ID to insert
    this.getNextID("Comments", "CFID-").then((response) => {
      //Create object to post to the sharepoint
      const Comment = (<HTMLInputElement>document.getElementById("CommentsInputField")).value;
      const CommenterID = this.context.pageContext.user.displayName;
      const siteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Comments')/Items"
      const itemBody: any = {
        "Title": response,
        "VersionID": VID,
        "UserID": CommenterID,
        "Comment": Comment
      }

      //Make The object into a Json and insert the options (The total message), the details about the Client are automatically inserted.
      const spHttpClientOptions: ISPHttpClientOptions = {
        "body": JSON.stringify(itemBody)
      }

      //The posting action of the message to the SharePoint.
      this.context.spHttpClient.post(siteUrl, SPHttpClient.configurations.v1, spHttpClientOptions)
        .then((response: SPHttpClientResponse) => {
          this._renderCommentsAsync(VID);
          (<HTMLInputElement>document.getElementById("CommentsInputField")).value = "";
        }).catch((e) => { console.log(e) });
    }).catch((e) => { console.log(e) });
  }

  //Post/Add method for an answer about a specific question.
  // - Parameter: QID: string, this is the Question ID of the version.
  // - Returns:   Void
  // - Example:   Follows the binding of the Question answer save button. 
  private addAnswerItem(QID: string): void {

    //Find the next Answer ID to insert
    this.getNextID("Answers", "AID-").then((response) => {
      //Create object to post to the sharepoint
      const element: string = QID + 'InputField';
      const Answer = (<HTMLInputElement>document.getElementById(element)).value;
      const CommenterID = this.context.pageContext.user.displayName;
      const siteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Answers')/Items"
      const itemBody: any = {
        "Title": response,
        "QuestionID": QID,
        "UserID": CommenterID,
        "Answer": Answer
      }

      //Make The object into a Json and insert the options (The total message), the details about the Client are automatically inserted.
      const spHttpClientOptions: ISPHttpClientOptions = {
        "body": JSON.stringify(itemBody)
      }

      //The posting action of the message to the SharePoint.
      this.context.spHttpClient.post(siteUrl, SPHttpClient.configurations.v1, spHttpClientOptions)
        .then((response: SPHttpClientResponse) => {
          this._renderAnswersAsync(QID);
          (<HTMLInputElement>document.getElementById(element)).value = "";
        }).catch((e) => { console.log(e) });
    }).catch((e) => { console.log(e) });


  }

  //Preperation method for to add formal feedback to a version.
  // - Parameter: VID: string, this is the Version ID of the version.
  // - Returns:   Void
  // - Example:   Follows the binding of the Formal feedback save button.
  // - TODO:      This manner allows the 4 formal feedbacks to have the same ID. 
  //              It would be better if it was recusive, similar to how feedback questions are saved with new writings.
  private addFormalItem(VID: string): void {
    const Top = (<HTMLInputElement>document.getElementById("TopsInputField")).value;
    const Tip = (<HTMLInputElement>document.getElementById("TipsInputField")).value;
    const General = (<HTMLInputElement>document.getElementById("GeneralInputField")).value;
    const Nitpick = (<HTMLInputElement>document.getElementById("NitpicksInputField")).value;
    const CommenterID = this.context.pageContext.user.displayName;
    const VersionID = VID

    this.PostFormalFeedbackItem(Top, "TopsInputField", VersionID, CommenterID);
    this.PostFormalFeedbackItem(Tip, "TipsInputField", VersionID, CommenterID);
    this.PostFormalFeedbackItem(General, "GeneralInputField", VersionID, CommenterID);
    this.PostFormalFeedbackItem(Nitpick, "NitpicksInputField", VersionID, CommenterID);
  }

  //Post/Add method for a formal feedback items.
  // - Parameter: VID: string, this is the Version ID of the version.
  // - Returns:   Void
  // - Example:   contained in the addFormalItem(); function.
  private PostFormalFeedbackItem(FieldValue:string, FieldID:string, VersionID:string, CommenterID:string):void{
    //Checks whether the value is not empty
    if (FieldValue !== "") {
      const siteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Formal Feedback')/Items"
      //Check which Formal feedback ID should be used.
      this.getNextID("Formal feedback", "FFID-").then((response) => {
        //Construct the Object to be sent to Sharepoint
        const itemTopBody: any = {
          "Title": response,
          "VersionID": VersionID,
          "FeedbackerID": CommenterID,
          "Content": FieldValue,
          "FormalType": "Tops"
        }
        const spHttpClientOptions: ISPHttpClientOptions = {
          "body": JSON.stringify(itemTopBody)
        }
        //The actual posting of the object. 
        this.context.spHttpClient.post(siteUrl, SPHttpClient.configurations.v1, spHttpClientOptions)
          .then((response: SPHttpClientResponse) => {
            (<HTMLInputElement>document.getElementById(FieldID)).value = "";
            this._renderFormalsAsync(VersionID);
          }).catch((e) => { console.log(e) });
      }).catch((e) => { console.log(e) });
    }
  }

  //Async render flow method to render the writing description and author in the documentview.
  // - Parameter: VID: string, this is the Version ID of the version.
  // - Returns:   Void
  // - Example:   This method should be called each time the document gets loaded in.
  private _renderDocumentDescriptionAsync(VID: string): void {
    this._getDocumentSingledata(VID)
      .then((response) => {
        this._renderDocumentDescription(response.value);
      })
      .catch((e) => { console.log(e) });
  }

  //Get writing single method based off of a VersionID.
  // - Parameter: VID: string, this is the Version ID of the version.
  // - Returns:   Promise of a list of writing Singles
  // - Example:   return _getDocumentSingledata("VID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private _getDocumentSingledata(VID: string): Promise<Objects.ISingleList> {
    return this.getSingleIDFromVersionID(VID).then((response) => {
      return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Singles')/items?$filter=Title eq '` + response + `' & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        })
        .catch(() => { return });
    }).catch(() => { return });
  }

  //Get writing SingleID method based off of the given VersionID.
  // - Parameter: VID: string, this is the Version ID of the version.
  // - Returns:   Promise of a riting SingleID
  // - Example:   return getSingleIDFromVersionID("VID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private getSingleIDFromVersionID(VID: string): Promise<string> {
    return this.getVersionIDList(VID).then((response) => {
      return response.value[0].SingleID
    })
  }

  //Get method to get the Version information based off of the VersionID.
  // - Parameter: VID: string, this is the Version ID of the version.
  // - Returns:   Promise of a list of version items
  // - Example:   return getVersionIDList("VID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  // - TODO:      Possibly a duplicate method, needs to be checked.
  private getVersionIDList(VID: string): Promise<Objects.IVersionList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Versions')/items?$filter=Title eq '` + VID + `'`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      }).catch((e) => { console.log(e) });
  }

  //Render method for the description and author reference in the document view.
  // - Parameter: items: a list of SingleListItems, this is the list of singles that match the presented version in the document view.
  //              items should only ever have a length of 1;
  // - Returns:   Void
  // - Example:   used in the .then((response)=>{}) portion of a Single Get method.
  private _renderDocumentDescription(items: Objects.ISingleListItem[]): void {
    let html: string = '';
    if(items.length!==0){
      (<HTMLElement>this.domElement.querySelector('#TitleContainer')).innerHTML = items[0].SingleTitle;
      html += '<p>By ' + items[0].AuthorID + '</p>';
      html += '<p>' + items[0].Description + '</p>';
    }else{
      (<HTMLElement>this.domElement.querySelector('#TitleContainer')).innerHTML = "404 - not found";
      html += '<p>By 404 - not found </p>';
      html += '<p> 404 - not found </p>';
    }
    this.domElement.querySelector('#DescContainer')!.innerHTML = html;
  }

  //Async render flow method to render the comments in the comments section in the feedbacking area.
  // - Parameter: VID: string, this is the Version ID of the version.
  // - Returns:   Void
  // - Example:   This method should be called each time the document gets loaded in.
  private _renderCommentsAsync(VID: string): void {
    this._getCommentsListdata(VID)
      .then((response) => {
        this._renderCommentsList(response.value);
      })
      .catch((e) => { console.log(e) })
  }

  //Get comments method based off of a VersionID.
  // - Parameter: VID: string, this is the Version ID of the version.
  // - Returns:   Promise of a list of comments
  // - Example:   return _getCommentsListdata("VID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  // - TODO:      The feedback settings don't seem to function as expected, this needs to be fixed.
  private _getCommentsListdata(VID: string): Promise<Objects.ICommentList> {
    if (this.OtherFeedbackVisibility) {
      return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Comments')/items?$filter= VersionID eq '` + VID + `' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        })
        .catch(() => { return });
    } else {
      return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Comments')/items?$filter= VersionID eq '` + VID + `' &$filter= UserID eq '` + this.context.pageContext.user.displayName + `'`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        })
        .catch(() => { return });
    }
  }

  //Render method for the comments about a document in the comments feedback area .
  // - Parameter: items: a list of comment items, this is the list of comments that match the presented version in the document view.
  // - Returns:   Void
  // - Example:   used in the .then((response)=>{}) portion of a Comment Get method.
  private _renderCommentsList(items: Objects.ICommentListItem[]): void {
    let html: string = ``;
    items.forEach((item: Objects.ICommentListItem) => {
      html += `<div style=" width:100%; margin: 5%; display: grid; grid-template-columns: 1fr 9fr;">`;
      html += `<img src="${require('../../shared/assets/person.png')}"`;
      html += `alt="" style="width: 100%; margin: 5%;">`;
      html += `<div><p>` + item.UserID + `</p>`;

      html += `<br><p>` + item.Comment + `</p>`;
      html += `<br><p>` + item.Created + `</p></div></div>`;
    });
    this.domElement.querySelector('#CommentsArea')!.innerHTML = html;
  }

  //Async render flow method to render the questions in the feedback questions section in the feedbacking area.
  // - Parameter: VID: string, this is the Version ID of the version.
  // - Returns:   Void
  // - Example:   This method should be called each time the document gets loaded in.
  private _renderQuestionsAsync(VID: string): void {
    this._getQuestionsListdata(VID)
      .then((response) => {
        this._renderQuestionsList(response.value);
      })
      .catch((e) => { console.log(e) })
  }

  //Get Questions method based off of a VersionID.
  // - Parameter: VID: string, this is the Version ID of the version.
  // - Returns:   Promise of a list of questions
  // - Example:   return _getQuestionsListdata("VID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private _getQuestionsListdata(VID: string): Promise<Objects.IQuestionList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Questions')/items?$filter= VersionID eq '` + VID + `' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Render method for the Questions about a document in the feedback questions feedback area.
  // - Parameter: items: a list of question items, this is the list of feedback questions that match the presented version in the document view.
  // - Returns:   Void
  // - Example:   used in the .then((response)=>{}) portion of a questions Get method.
  private _renderQuestionsList(items: Objects.IQuestionListItem[]): void {
    let html: string = ``;
    items.forEach((item: Objects.IQuestionListItem) => {
      html += `<button type="button" class="${styles.collapsible}" style="background-color: #e4341c;"
    onclick="
      if(document.getElementById('`+ item.Title + `').style.display === 'none'){
        document.getElementById('`+ item.Title + `').style.display = 'block';
      }else{
        document.getElementById('`+ item.Title + `').style.display = 'none';
      }"
    >`+ item.Question + `</button>
    <div id="`+ item.Title + `" class="${styles.content}" style=" display:none;">
    <div id="`+ item.Title + `Container">
    `;

      html += `</div>
  <div class="${styles.Answer}">
    <p>My answer</p>
    <textarea id="`+ item.Title + `InputField" type="text" style="margin-left: 5%; max-width:80%; width:80%; min-width:80%;"></textarea>
    <button id="`+ item.Title + `InputSend" style="float: right; margin-right: 10%;">Send</button>
  </div>
</div>`;
    });
    this.domElement.querySelector('#QAContainer')!.innerHTML = html;

    items.forEach((item: Objects.IQuestionListItem) => {
      this._renderAnswersAsync(item.Title);
      this._bindAnswerSave(item.Title);
    });
  }

  //Async render flow method to render the answers in the feedback questions dropdowns in the feedbacking area.
  // - Parameter: QID: string, this is the Question ID of the question the anser is connected to.
  // - Returns:   Void
  // - Example:   This method should be called each time the questions get loaded in.
  private _renderAnswersAsync(QID: string): void {
    this._getAnswersListdata(QID)
      .then((response) => {
        this._renderAnswersList(response.value, QID);
      })
      .catch((e) => { console.log(e) })
  }

  //Get ansers method based off of a QuestionID.
  // - Parameter: QID: string, this is the Question ID of the feedback question.
  // - Returns:   Promise of a list of ansers
  // - Example:   return _getAnswersListdata("VID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  // - TODO:      The feedback settings seem to not function as desired, this needs to be fixed
  private _getAnswersListdata(QID: string): Promise<Objects.IAnswerList> {
    if (this.OtherFeedbackVisibility) {
      return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Answers')/items?$filter= QuestionID eq '` + QID + `'`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        })
        .catch(() => { return });
    } else {
      return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Answers')/items?$filter= QuestionID eq '` + QID + `' &$filter= UserID eq '` + this.context.pageContext.user.displayName + `'`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        })
        .catch(() => { return });
    }
  }

  //Render method for the Answers about a question in a document in the feedback questions dropdown field.
  // - Parameter: items: a list of anser items, this is the list of feedback question ansers that match the presented questions in the feedback questions area.
  // - Parameter: QuestionID: string, the ID of the related question.
  // - Returns:   Void
  // - Example:   used in the .then((response)=>{}) portion of a answer Get method.
  private _renderAnswersList(items: Objects.IAnswerListItem[], QuestionID: string): void {
    let html: string = ``;
    items.forEach((item: Objects.IAnswerListItem) => {
      html += `
      <div class="${styles.Answer}">
        <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
        <div>
          <p>`+ item.UserID + `</p>
          <p style="margin-left: 5%;">`+ item.Answer + `</p>
        </div>
      </div>`;
    });
    const Container: string = '#' + QuestionID + 'Container';
    this.domElement.querySelector(Container)!.innerHTML = html;
  }

  //Async render flow method to render the formal feedback ansers in the feedbacking area.
  // - Parameter: VID: string, this is the Version ID of the version.
  // - Returns:   Void
  // - Example:   This method should be called each time the document get loaded in.
  private _renderFormalsAsync(VID: string): void {
    this._getFormalListdata(VID)
      .then((response) => {
        this._renderFormalList(response.value);
      })
      .catch((e) => { console.log(e) })
  }

  //Get formal feedback method based off of a VersionID.
  // - Parameter: VID: string, this is the Version ID of the version.
  // - Returns:   Promise of a list of formal feedback
  // - Example:   return _getFormalListdata("VID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  // - TODO:      The feedback settings seem to not function as desired, this needs to be fixed
  private _getFormalListdata(VID: string): Promise<Objects.IFormalList> {
    if (this.OtherFeedbackVisibility) {
      return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Formal feedback')/items?$filter= VersionID eq '` + VID + `'`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        })
        .catch(() => { return });
    } else {
      return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Formal feedback')/items?$filter= VersionID eq '` + VID + `' &$filter= FeedbackerID eq '` + this.context.pageContext.user.displayName + `'`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        })
        .catch(() => { return });
    }
  }

  //Render method for the formal feedback about a document in the formal feedback area.
  // - Parameter: items: a list of formal feedback items, this is the list of formal feedback additions that match the presented document in the document view.
  // - Returns:   Void
  // - Example:   used in the .then((response)=>{}) portion of a formalfeedback Get method.
  private _renderFormalList(items: Objects.IFormalListItem[]): void {
    let htmlTips: string = ``;
    let htmlTops: string = ``;
    let htmlGeneral: string = ``;
    let htmlNitpicks: string = ``;
    items.forEach((item: Objects.IFormalListItem) => {
      let addition: string = ``;
      addition += `<div class="${styles.Answer}">
      <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
      <div>
        <p>`+ item.FeedbackerID + `</p>
        <br>
        <p>`+ item.Content + `</p>
      </div>
    </div>`;
      switch (item.FormalType) {
        case "Tips": {
          htmlTips += addition;
          break;
        }
        case "Tops": {
          htmlTops += addition;
          break;
        }
        case "Nitpicks": {
          htmlNitpicks += addition;
          break;
        }
        case "General":
        default: {
          htmlGeneral += addition;
          break;
        }
      }
    });
    this.domElement.querySelector(`#TipsContent`)!.innerHTML = htmlTips;
    this.domElement.querySelector(`#TopsContent`)!.innerHTML = htmlTops;
    this.domElement.querySelector(`#GeneralContent`)!.innerHTML = htmlGeneral;
    this.domElement.querySelector(`#NitpicksContent`)!.innerHTML = htmlNitpicks;
  }

  //Async render flow method to render the riting icons in the explore view.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should be called once after the initial render of the webpart
  private _renderWritingIconsAsync(): void {
    this._getWritingiconsListdata()
      .then((response) => {
        this._renderWritingiconsList(response.value);
      })
      .catch((e) => { console.log(e) })
  }

  //Get method for the writing icons used to represent each collection and single in the explore view..
  // - Parameter: None
  // - Returns:   Promise of a list of writings (Collections and singles)
  // - Example:   return _getWritingiconsListdata().then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private _getWritingiconsListdata(): Promise<Objects.IWritingList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Writings')/items?&filter=Visibility eq 'Public' $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Render method for all the publicily available writings which will be show in icon form to the user.
  //The icons are colour coded to the corresponding writing type and contain images for the writing type and hether they are a collection or a single. 
  // - Parameter: items: a list of writings.
  // - Returns:   Void
  // - Example:   used only when the explore webpart is first rendered
  // - TODO:      There is a small visual bug at the bottom of the icons here the colour pokes outside of the icons border, this still needs to be fixed.
  private _renderWritingiconsList(items: Objects.IWritingListItem[]): void {
    let html: string = '';
    this.writingItems = items;
    items.forEach((item: Objects.IWritingListItem) => {
      //Secondary visibility check
      if (item.Visibility === "Public") {
        //Set the writing type imag and style
        switch (item.Writingtype) {
          case "Fiction":
            html += `
              <div class="${styles.exploreitemf} ${styles.griditem} " id="${item.Title}" onclick="">
              <img src="${require('../../shared/assets/fiction.png')}" class="${styles.exploreicon}">`;
            break;
          case "Nonfiction":
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
        html += `<div class="${styles.exploreitem}" style="border-radius: inherit;">
          <div style="position:relative; width:100%; height:100%;">`;
        if (item.WorkType === "Collection") {
          html += `<img src="${require('../../shared/assets/doc.png')}" class="${styles.exploreBackground2}">`;
        } else {
          html += `<img src="${require('../../shared/assets/page.png')}" class="${styles.exploreBackground2}">`;
        }
        html += `</div>`;
        if (item.Triggers !== null) {
          html += `
            <p style="float: right; position: absolute; top: 5%; right: 5%; font-weight: bolder;">!</p>`;
        }
        html += `<div style="overflow: hidden; position: absolute; height: 30%; width: 100%; `;
        //Set the corrosponding background colour of the textbox
        switch (item.Writingtype) {
          case "Fiction":
            html += `background-color: #0092d2;`;
            break;
          case "Nonfiction":
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
        //Add the base info, the deatils button and the bottom portion of the icon.
        html += `bottom: 0%; font-size: small;">
                <p style="float: left; width: 80%;">
                ${item.Writingtitle}
                  <br>
                  By <a href="account descirption.html" style="color: #000;">${item.Owner}</a>

                </p>
                <button  id="${item.Title}Detailsdrop"     data-ID="${item.Title}" data-desc="${item.Owner}"
                  style="border-radius: 50%; padding: 2%; cursor: pointer; text-align: center; color: black; background-color: white; float: right;"
                  onclick="">i</button>
              </div>
            </div>
          </a>
        </div>`;
      }
    });
    //Set the list of icons in the container
    if (this.domElement.querySelector('#WritingListContainer') !== null) {
      this.domElement.querySelector('#WritingListContainer')!.innerHTML = html;
    }
    //Set the onclick listeners for the detail buttons and the overview openers.
    items.forEach((item: Objects.IWritingListItem) => {
      this.handleOverviewClick(item.Title);
      this.handleDetailDropClick(item);
    });

  }

  //A click listener method for the writing icons so they can show the correct overview.
  // - Parameter: id: string, the writing id of the writingicon that is gets the event listener.
  // - Returns:   Void
  // - Example:   used for each writing icon. 
  private handleOverviewClick(id: string): void {
    this.domElement.querySelector("#" + id)?.addEventListener('click', () => {
      (<HTMLElement>this.domElement.querySelector('#ExploreContainer')).style.display = "none";
      this._renderWritingAsync(id);
    })
  }

  //A click listener method for the writing icon's i-icons so they can open de detail window with some basic information.
  // - Parameter: item: Writing item, the writing item that is represented by the writing icon.
  // - Returns:   Void
  // - Example:   used for each writing icon. 
  private handleDetailDropClick(item: Objects.IWritingListItem): void {
    this.domElement.querySelector("#" + item.Title + "Detailsdrop")?.addEventListener('click', (e) => {
      e.stopPropagation();
      (<HTMLElement>this.domElement.querySelector('#WritingListContainer')).style.height = '55%';
      (<HTMLElement>this.domElement.querySelector('#DetailMenu')).style.height = '40%';
      (<HTMLElement>this.domElement.querySelector('#DetailsCloseButton')).style.display = 'block';

      const html: string = `
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

  //Get method for the last ID used find the next possible ID of a given list.
  // - Parameter: ListName: string, the name of the desired list according to sharepoint.
  // - Returns:   Promise of a list of IDs
  // - Example:   return _getLatestIDListdata("Comments").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private _getLatestIDListdata(ListName:string): Promise<Objects.IIDList>{
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${ListName}')/items?$select=ID, Title&$orderby=ID desc&$top= 1`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Get method for the next possible ID of a given list and ID marker.
  // - Parameter: ListName: string, the name of the desired list as is named in sharepoint.
  // - Parameter: ListMarker: string, a marker to define the origin of the ID. 
  // - Returns:   Promise of a string, the next possible ID.
  // - Example:   return _getLatestIDListdata("Comments", "CFID-").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private getNextID(ListName: string, IDMarker:string):Promise<string>{
    return this._getLatestIDListdata(ListName).then((response) => {
      let ID: string = IDMarker+"1";
      if (response.value.length !== 0) {
        const NewestID = response.value[0].Title;
        const substring = NewestID.replace(IDMarker, "");
        let IDnumber = parseInt(substring);
        IDnumber++;
        ID = IDMarker + IDnumber;
        return ID;
      } else {
        return ID;
      }
    })
  }

  //A composition method coding overvie, this method renders all the dynamic filters.
  // - Parameter: None 
  // - Returns:   Void
  // - Example:   used once at the initial rendering of the explore webpart.
  private _renderAllFilters(): void {
    this._renderGenreListAsync();
    this._renderTriggerListAsync();
    this._renderTagListAsync();
  }

  //Async render flow method to render the Genres within the filter area in the explore view.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should be called once after the initial render of the webpart
  private _renderGenreListAsync(): void {
    this._getGenreListData()
      .then((response) => {
        this._renderGenreList(response.value);
      })
      .catch((e) => { console.log(e) })
  }

  //Get method for all the available genres to show them in the filters area of the explore view.
  // - Parameter: None
  // - Returns:   Promise of a list of Genres, A list of all the dyanmically made Genres 
  // - Example:   return _getGenreListData().then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private _getGenreListData(): Promise<Objects.IGenreList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Genres')/items?$select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Render method for the filter fields of each genre.
  // - Parameter: items: a list of genres.
  // - Returns:   Void
  // - Example:   used in the .then((response)=>{}) portion of a Genre Get method.
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

  //Async render flow method to render the triggers within the filter area in the explore view.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should be called once after the initial render of the webpart
  private _renderTriggerListAsync(): void {
    this._getTriggerListData()
      .then((response) => {
        this._renderTriggerList(response.value);
      })
      .catch((e) => { console.log(e) })
  }

  //Get method for all the available triggers to show them in the filters area of the explore view.
  // - Parameter: None
  // - Returns:   Promise of a list of Triggers, A list of all the dyanmically made Triggers 
  // - Example:   return _getTriggerListData().then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private _getTriggerListData(): Promise<Objects.ITriggerList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Triggers')/items?$select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {

        return response.json();
      })
      .catch(() => { return });
  }

  //Render method for the filter fields of each trigger.
  // - Parameter: items: a list of triggers.
  // - Returns:   Void
  // - Example:   used in the .then((response)=>{}) portion of a Trigger Get method.
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

  //Async render flow method to render the tags within the filter area in the explore view.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should be called once after the initial render of the webpart
  private _renderTagListAsync(): void {
    this._getTagListData()
      .then((response) => {
        this._renderTagList(response.value);
      })
      .catch((e) => { console.log(e) })
  }

  //Get method for all the available tags to show them in the filters area of the explore view.
  // - Parameter: None
  // - Returns:   Promise of a list of Tags, A list of all the dyanmically made tags 
  // - Example:   return _getTagListData().then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private _getTagListData(): Promise<Objects.ITagList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Tags')/items?$select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Render method for the filter fields of each tag.
  // - Parameter: items: a list of tags.
  // - Returns:   Void
  // - Example:   used in the .then((response)=>{}) portion of a Tag Get method.
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

  //Async render flow method to render the overview of a writing.
  // - Parameter: WID: string, the writing ID of the chosen writing (This can be a Collection or a Single)
  // - Returns:   Void
  // - Example:   This method should be called each time after clicking a writing icon.
  private _renderWritingAsync(WID: string): void {
    this._getWritingListdata(WID)
      .then((response) => {
        this._renderWriting(response.value);
      })
      .catch((e) => { console.log(e) })
  }

  //Get method for all the chosen writing to show the details in the writing overview.
  // - Parameter: WID: string, the writing ID of the chosen writing (This can be a Collection or a Single)
  // - Returns:   Promise of a list of writings, the searched for writing.
  //              The list should only have a length of 1;
  // - Example:   return _getWritingListdata("WID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private _getWritingListdata(WID: string): Promise<Objects.IWritingList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Writings')/items?$filter= Title eq '` + WID + `' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Render method for the chosen writing in the writing overview (could be collection overview or single overview).
  // - Parameter: items: a list of writings.
  //              items should only have a length of 1.
  // - Returns:   Void
  // - Example:   used everytime a writing icon has been clicked.
  // - TODO:      Genres, Triggers and Tags are not shown in appealing manner
  // - TODO:      The last updated date and first uploaded date have been commented as they cause issues with html loading. This needs to be fixed
  private _renderWriting(items: Objects.IWritingListItem[]): void {
    const item = items[0];
    if (item.WorkType === "Collection") {
      (<HTMLElement>this.domElement.querySelector('#CollectionOverview')).style.display = "block";
      (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "none";

      this.domElement.querySelector('#CollectionOverviewDesc')!.innerHTML = item.Description;
      this.domElement.querySelector('#CollectionTitleField')!.innerHTML = item.Writingtitle;
      this.domElement.querySelector('#CollectionOwnerField')!.innerHTML = item.Owner;
      this.domElement.querySelector('#CollectionViewField')!.innerHTML = item.Views.toString();

      //this.domElement.querySelector('#CollectionFirstVersionDateField')!.innerHTML = "" + item.FirstPosted;
      //this.domElement.querySelector('#CollectionLastUpdateField')!.innerHTML = "" + item.LastUpdated;
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
    } else {
      (<HTMLElement>this.domElement.querySelector('#CollectionOverview')).style.display = "none";
      (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "block";
      this.domElement.querySelector('#SingleOverviewDesc')!.innerHTML = item.Description;

      this.domElement.querySelector('#SingleViewField')!.innerHTML = item.Views.toString();
      this.domElement.querySelector('#SingleLastUpdateField')!.innerHTML = "" + item.LastUpdated;
      this.domElement.querySelector('#SingleFeedbackersField')!.innerHTML = item.FeedbackReceived.toString();

      this._renderSingleAsync(item.Reference);
      this.domElement.querySelector('#latestVersionRedirectButton')!.innerHTML = "Go to latest version &rarr";
    }
  }

  //Async render flow method to render the collection within the collection overview.
  // - Parameter: CID: string, is the collectionID that of the chosen collection.
  // - Returns:   Void
  // - Example:   This method should be called each time a collection overview is opened.
  private _renderCollectionAsync(CID: string): void {
    this._getCollectionListdata(CID)
      .then((response) => {
        this._renderCollection(response.value);
      })
      .catch((e) => { console.log(e) })
  }

  //Get method for all the chosen collection to show the details in the writing overview.
  // - Parameter: CID: string, the collection ID of the chosen collection.
  // - Returns:   Promise of a list of collections, the searched for collection.
  //              The list should only have a length of 1
  // - Example:   return _getCollectionListdata("CID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private _getCollectionListdata(CID: string): Promise<Objects.ICollectionList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Collections')/items?$filter= Title eq '` + CID + `' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Render method for the collection in the collection overview.
  // - Parameter: items: a list of collection.
  //              items should only have a length of 1.
  // - Returns:   Void
  // - Example:   used everytime the collection overview is loaded.
  private _renderCollection(items: Objects.ICollectionListItem[]): void {
    const item = items[0];
    this.domElement.querySelector('#CollectionTitleField')!.innerHTML = item.CollectionTitle;
    this._renderSinglesAsync(item.Title);
  }

  //Async render flow method to render the singles in the subdivision table of a collection overview.
  // - Parameter: CID: string, is the collectionID that of the chosen collection.
  // - Returns:   Void
  // - Example:   This method should be called each time a collection overview is opened.
  private _renderSinglesAsync(CID: string): void {
    this._getSinglesListdata(CID)
      .then((response) => {
        this._renderSingles(response.value);
      })
      .catch((e) => { console.log(e) })
  }

  //Get method for all the related singles related to the chosen collection.
  // - Parameter: CID: string, the collection ID of the chosen collection.
  // - Returns:   Promise of a list of single writings, the list of relatedsingle pieces of riting related to the chosen collection.
  // - Example:   return _getSinglesListdata("CID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private _getSinglesListdata(CID: string): Promise<Objects.ISingleList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Singles')/items?$filter= CollectionID eq '` + CID + `' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Render method for the singles in the collection overview which will be rendered in the collection overvie subdivision table.
  // - Parameter: items: a list of singles.
  // - Returns:   Void
  // - Example:   used everytime the collection overview is loaded.
  private _renderSingles(items: Objects.ISingleListItem[]): void {
    let html = `
  <tr>
    <th>Chapter/component</th>
    <th>Date</th>
    <th>Link</th>
  </tr>`;
    items.forEach((item: Objects.ISingleListItem) => {
      //TODO: have the created date be a bit better looking
      html += `
    <tr>
      <td>`+ item.SingleTitle + `</td>
      <td>`+ item.Created + `</td>
      <td> <button id="`+ item.Title + `">To Chapter&rarr;</button></td>
    </tr>`;
    });
    this.domElement.querySelector('#CollectionSubdivisionTable')!.innerHTML = html;
    items.forEach((item: Objects.ISingleListItem) => {
      this._bindSingleButtons(item.Title);
    })
    this._bindLatestSingle(items[items.length - 1].Title);
  }

  //Button binding method to bind the available single buttons in the subdivision table in the collection overview.
  //This method allows the user to quickly access the any of the singles related to the collection.
  // - Parameter: SID: string, the single ID of chosen Single. 
  // - Returns:   Void
  // - Example:   This method should be used everytime the collection overview get loaded for every related Single.
  private _bindSingleButtons(SID: string): void {
    this.domElement.querySelector('#' + SID)?.addEventListener('click', () => {
      (<HTMLElement>this.domElement.querySelector('#CollectionOverview')).style.display = "none";
      (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "block";
      this._renderSingleAsync(SID)
    })

  }

  //Button binding method to bind the latest single button in the collection overview.
  //This method allows the user to quickly access the latest single piece of writing instead of going through the subdivision table.
  // - Parameter: SID: string, the single ID of the last uploaded single. 
  // - Returns:   Void
  // - Example:   This method should be used everytime the collection overview get loaded.
  private _bindLatestSingle(SID: string): void {
    this.domElement.querySelector('#latestSingleRedirectButton')?.addEventListener('click', () => {
      (<HTMLElement>this.domElement.querySelector('#CollectionOverview')).style.display = "none";
      (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "block";
      this._renderSingleAsync(SID)
    })
  }

  //Async render flow method to render the chosen single piece of writing within the single overview.
  // - Parameter: SID: string, is the singleID that of the chosen single piece of writing.
  // - Returns:   Void
  // - Example:   This method should be called each time a single overview is opened.
  private _renderSingleAsync(SID: string): void {
    this._getSingleListdata(SID)
      .then((response) => {
        this._renderSingle(response.value);
      })
      .catch((e) => { console.log(e) })
  }

  //Get method for the single piece of riting with the given SingleID.
  // - Parameter: SID: string, the single ID of the chosen single piece of writing.
  // - Returns:   Promise of a list of single writings, a list of singles that match the given SingleID.
  //              This list should only have a length of 1.
  // - Example:   return _getSingleListdata("SID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private _getSingleListdata(SID: string): Promise<Objects.ISingleList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Singles')/items?$filter= Title eq '` + SID + `' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Render method for the single in the single piece of writing overview.
  // - Parameter: items: a list of singles.
  //              items should only have a length of 1.
  // - Returns:   Void
  // - Example:   used everytime the single overview is loaded.
  // - TODO:      Genres, Triggers and Tags are not shown in appealing manner
  // - TODO:      The last updated date and first uploaded date have been commented as they cause issues with html loading. This needs to be fixed
  private _renderSingle(items: Objects.ISingleListItem[]): void {
    const item = items[0];

    this.domElement.querySelector('#SingleTitleField')!.innerHTML = item.SingleTitle;
    this.domElement.querySelector('#SingleOwnerField')!.innerHTML = item.AuthorID;
    //this.domElement.querySelector('#SingleViewField')!.innerHTML = item.Views.toString();
    this.domElement.querySelector('#SingleFirstVersionDateField')!.innerHTML = "" + item.Created;
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

  //Async render flow method to render the related versions in the subdivisiontable of the chosen single in the single overview.
  // - Parameter: SID: string, is the singleID that of the chosen single piece of writing.
  // - Returns:   Void
  // - Example:   This method should be called each time a single overview is opened.
  private _renderVersionsAsync(SID: string): void {
    this._getVersionsListdata(SID)
      .then((response) => {
        this._renderVersions(response.value);
      })
      .catch((e) => { console.log(e) })
  }

  //Get method for all the versions related to the chosen Single piece of writing.
  // - Parameter: SID: string, the Single ID of the chosen single piece of writing.
  // - Returns:   Promise of a list of versions, the list of related versions of a single piece of writing.
  // - Example:   return _getVersionsListdata("SID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  // - TODO:      This method may be a duplicate, it may be possible to merge them.
  private _getVersionsListdata(SID: string): Promise<Objects.IVersionList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Versions')/items?$filter= SingleID eq '` + SID + `' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Render method for the versions in the single overview which will be rendered in the single overview subdivision table.
  // - Parameter: items: a list of versions.
  // - Returns:   Void
  // - Example:   used everytime the single overview is loaded.
  private _renderVersions(items: Objects.IVersionListItem[]): void {
    let html = `
  <tr>
    <th>Version</th>
    <th>Date</th>
    <th>Link</th>
  </tr>`;
    items.forEach((item: Objects.IVersionListItem) => {
      //TODO: have the created date be a bit better looking
      html += `
    <tr>
      <td>`+ item.VersionName + `</td>
      <td>`+ item.Created + `</td>
      <td> <button id="`+ item.Title + `">To Version&rarr;</button></td>
    </tr>`;
    });
    this.domElement.querySelector('#SingleSubdivisionTable')!.innerHTML = html;
    items.forEach((item: Objects.IVersionListItem) => {
      this.bindVersionButton(item.Title)
    });
    this._bindLatestVersion(items[items.length - 1].Title);
  }

  //Button binding method to bind the version buttons in the single piece of writing overview.
  //This method allows the user to access the each available version of a piece of writing.
  // - Parameter: VID: string, the version ID of the chosen version. 
  // - Returns:   Void
  // - Example:   This method should be used everytime the Single overview get loaded for every related version to the chosen single.
  private bindVersionButton(VID: string): void {
    this.domElement.querySelector('#' + VID)?.addEventListener('click', () => {
      this._openDocumentView(VID);
    })
  }

  //Button binding method to bind the latest version button in the single piece of writing overview.
  //This method allows the user to quickly access the latest version instead of going through the subdivision table.
  // - Parameter: VID: string, the version ID of the last uploaded version. 
  // - Returns:   Void
  // - Example:   This method should be used everytime the Single overview get loaded.
  private _bindLatestVersion(VID: string): void {
    this.domElement.querySelector('#latestVersionRedirectButton')?.addEventListener('click', () => {
      this._openDocumentView(VID);
    })
  }

  //Method to remove the singleview and show the document view. 
  //The method then sets the correct document information in the document view.
  // - Parameter: VID: string, the version ID of the chosen version. 
  // - Returns:   Void
  // - Example:   This method follows the on click listener for each version button and the last version button.
  private _openDocumentView(VID: string): void {
    (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "none";
    (<HTMLElement>this.domElement.querySelector('#WritingOverviewContainer')).style.display = "block";
    this._PresetDocument(VID);
  }

}
