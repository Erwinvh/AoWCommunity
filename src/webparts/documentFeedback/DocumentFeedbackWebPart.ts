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

export interface IDocumentFeedbackWebPartProps {
}

import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

export default class DocumentFeedbackWebPart extends BaseClientSideWebPart<IDocumentFeedbackWebPartProps> {
  public render(): void {
    this.domElement.innerHTML = `
    <div class="${styles.maincontainer}" style="overflow-y:hidden;">

    <div class="${styles.writinggrid}">
      <div id="WritingContainer">
        <div class="${styles.writingtitle}">
          <h1 id="TitleContainer">Writing title</h1>
        </div>

        <div class="${styles.writingmain}">
          <div id="DescContainer" class="${styles.writingdesc}"> Wrting description/summary/intro/author notes/written trigger warning</div>
          <!-- TODO: fix height -->
          <div id="Documentcontainer" style="height=100vh;">
            <pre style="margin: 5%; white-space: pre-line;">
              Lorem ipsum dolor sit amet, 
              consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    
              Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, 
              sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, 
              consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    
              Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, 
              sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, 
              consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            </pre>
          </div>
          <div class="${styles.relatedwritinggrid}">
            <div>
              <h3>Previous chapter/work:</h3>
              <a href="writingview.html">Previous chapter name</a>
            </div>
            <div>
              <h3>Collection:</h3>
              <a href="explore collection.html">Collection name</a>
            </div>
            <div>
              <h3>Next chapter/work:</h3>
              <a href="writingview.html">Next chapter name</a>
            </div>
          </div>
        </div>
      </div>

      <div id="FeedbackContainer">
        <div id="CommentsContainer" class="${styles.CommentContainer}" style="display:none;"> 
          <div class="${styles.CommentGrid}">
            <div id="commentstitle">
              <h2 style="text-align: center;">Comments:</h2>
            </div>
            <div id="CommentsArea" class="${styles.AnswerArea}">
                
            </div>
            <div id="CommentsInput">
            <br>
              <textarea id="CommentsInputField">
              </textarea>
              <button id="CommentsInputSend" onclick="addCommentItem();">Send</button>
            </div>
          </div>
        </div>

        <div id="InlineContainer" style="display:none;"> 
        <div id="Inlinetitle">
        <h2 style="text-align: center;">Inline feedback:</h2>
      </div>
      <p>TBD</p>
        </div>

        <div id="FormalContainer" style="display:none;"> 
        <div id="Formaltitle">
        <h2 style="text-align: center;">Formal feedback:</h2>
      </div>
      <div class="${styles.feecdbackquestions}">
        <button type="button" class="${styles.collapsible}" style="background-color: #e4341c;">Tops</button>
        <div class="${styles.content}">
          <div class="${styles.AnswerArea}">
            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <p>feedbacker name</p>
                <br>
                <p>Top 1</p>
              </div>
            </div>
            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <p>feedbacker name</p>
                <br>
                <p>Top 1</p>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="${styles.collapsible}" style="background-color: #e4341c;">Tips</button>
        <div class="${styles.content}">
          <div class="${styles.AnswerArea}">
            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <p>feedbacker name</p>
                <br>
                <p>tip 1</p>
              </div>
            </div>

            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <p>feedbacker name</p>
                <br>
                <p>Tip 1</p>
              </div>
            </div>
            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <p>feedbacker name</p>
                <br>
                <p>Tip 1</p>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="${styles.collapsible}" style="background-color: #e4341c;">Nitpicks</button>
        <div class="${styles.content}">
          <div class="${styles.AnswerArea}">
            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <p>feedbacker name</p>
                <br>
                <p>Nitpick 1</p>
              </div>
            </div>

            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <p>feedbacker name</p>
                <br>
                <p>Nitpick 1</p>
              </div>
            </div>
            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <p>feedbacker name</p>
                <br>
                <p>Nitpick 1</p>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="${styles.collapsible}" style="background-color: #e4341c;">General impression</button>
        <div class="${styles.content}">
          <div class="${styles.AnswerArea}">
            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <p>feedbacker name</p>
                <br>
                <p>General impression 1</p>
              </div>
            </div>

            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <p>feedbacker name</p>
                <br>
                <p>General impression 1</p>
              </div>
            </div>
            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <p>feedbacker name</p>
                <br>
                <p>General impression 1</p>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="${styles.collapsible}" style="background-color: #e4341c;">Submit feedback</button>
        <div class="${styles.content}">
          <div class="${styles.AnswerArea}">
            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <button style="float: right; margin-right: 10%;">
                  <h1>></h1>
                </button>
                <p>My tops:</p>
                <textarea type="text" style="margin-left: 5%;"></textarea>
              </div>
            </div>
            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <button style="float: right; margin-right: 10%;">
                  <h1>></h1>
                </button>
                <p>My tips:</p>
                <textarea type="text" style="margin-left: 5%;"></textarea>
              </div>
            </div>

            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <button style="float: right; margin-right: 10%;">
                  <h1>></h1>
                </button>
                <p>My nitpicks:</p>
                <textarea type="text" style="margin-left: 5%;"></textarea>
              </div>
            </div>
            <div class="${styles.Answer}">
              <img src="${require('../../shared/assets/person.png')}" alt="" style="width: 100%; margin: 5%;">
              <div>
                <button style="float: right; margin-right: 10%;">
                  <h1>></h1>
                </button>
                <p>My general impression:</p>
                <textarea type="text" style="margin-left: 5%;"></textarea>
              </div>
            </div>
          </div>
        </div>

        <script>
        var coll = document.getElementsByClassName("collapsible");
        var i;
    
        for (i = 0; i < coll.length; i++) {
          coll[i].addEventListener("click", function () {
            this.classList.toggle("activedropdown");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
              content.style.display = "none";
            } else {
              content.style.display = "block";
            }
          });
        }
      </script>



      </div>
        </div>

        <div id="QuestionsContainer" style="display:none;"> 
        <div id="Questionstitle">
        <h2 style="text-align: center;">Feedback questions:</h2>
      </div>

      <button type="button" class="${styles.collapsible}" style="background-color: #e4341c;">Question 1</button>
      <div class="${styles.content}">
        <div class="${styles.AnswerArea}">
          <div class="${styles.Answer}">
            <img src="../images/person.png" alt="" style="width: 100%; margin: 5%;">
            <div>
              <button style="float: right; margin-right: 10%;"><h1>></h1></button>
              <p>My answer:</p>
              <textarea type="text" style="margin-left: 5%;"></textarea>
            </div>
          </div>
          <div class="${styles.Answer}">
            <img src="../images/person.png" alt="" style="width: 100%; margin: 5%;">
            <div>
              <p>feedbacker name</p>
              <br>
              <p>answer 1</p>
            </div>
          </div>

          <div class="${styles.Answer}">
            <img src="../images/person.png" alt="" style="width: 100%; margin: 5%;">
            <div>
              <p>feedbacker name</p>
              <br>
              <p>answer 1</p>
            </div>
          </div>
          <div class="${styles.Answer}">
            <img src="../images/person.png" alt="" style="width: 100%; margin: 5%;">
            <div>
              <p>feedbacker name</p>
              <br>
              <p>answer 1</p>
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="${styles.collapsible}" style="background-color: #e4341c;">Question 2</button>
      <div class="${styles.content}">
        <div class="${styles.AnswerArea}">
          <div class="${styles.Answer}">
            <img src="../images/person.png" alt="" style="width: 100%; margin: 5%;">
            <div>
              <button style="float: right; margin-right: 10%;"><h1>></h1></button>
              <p>My answer:</p>
              <textarea type="text" style="margin-left: 5%;"></textarea>
            </div>
          </div>
          <div class="${styles.Answer}">
            <img src="../images/person.png" alt="" style="width: 100%; margin: 5%;">
            <div>
              <p>feedbacker name</p>
              <br>
              <p>answer 1</p>
            </div>
          </div>

          <div class="${styles.Answer}">
            <img src="../images/person.png" alt="" style="width: 100%; margin: 5%;">
            <div>
              <p>feedbacker name</p>
              <br>
              <p>answer 1</p>
            </div>
          </div>
          <div class="${styles.Answer}">
            <img src="../images/person.png" alt="" style="width: 100%; margin: 5%;">
            <div>
              <p>feedbacker name</p>
              <br>
              <p>answer 1</p>
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="${styles.collapsible}" style="background-color: #e4341c;">Question 3</button>
      <div class="${styles.content}">
        <div class="${styles.AnswerArea}">
          <div class="${styles.Answer}">
            <img src="../images/person.png" alt="" style="width: 100%; margin: 5%;">
            <div>
              <button style="float: right; margin-right: 10%;"><h1>></h1></button>
              <p>My answer:</p>
              <textarea type="text" style="margin-left: 5%;"></textarea>
            </div>
          </div>
          <div class="${styles.Answer}">
            <img src="../images/person.png" alt="" style="width: 100%; margin: 5%;">
            <div>
              <p>feedbacker name</p>
              <br>
              <p>answer 1</p>
            </div>
          </div>

          <div class="${styles.Answer}">
            <img src="../images/person.png" alt="" style="width: 100%; margin: 5%;">
            <div>
              <p>feedbacker name</p>
              <br>
              <p>answer 1</p>
            </div>
          </div>
          <div class="${styles.Answer}">
            <img src="../images/person.png" alt="" style="width: 100%; margin: 5%;">
            <div>
              <p>feedbacker name</p>
              <br>
              <p>answer 1</p>
            </div>
          </div>
        </div>
      </div>

        </div>
      </div>

      <div class="${styles.feedbackbuttons}">

        <div id="QuestionsButton" class="${styles.feedbackbutton}" 
          onclick="
          document.getElementById('QuestionsButton').style.display = 'none';
          document.getElementById('CommentsButton').style.display = 'block';
          document.getElementById('FormalButton').style.display = 'block';
          document.getElementById('InlineButton').style.display = 'block';


          document.getElementById('QuestionsCollapseButton').style.display = 'block';
          document.getElementById('InlineCollapseButton').style.display = 'none';
          document.getElementById('FormalCollapseButton').style.display = 'none';
          document.getElementById('CommentsCollapseButton').style.display = 'none';
          document.getElementById('CommentsContainer').style.display = 'none';
          document.getElementById('InlineContainer').style.display = 'none';
          document.getElementById('FormalContainer').style.display = 'none';
          document.getElementById('QuestionsContainer').style.display = 'block';

          " style="cursor:pointer;">
          <p>Questions</p>
        </div>
        <div id="QuestionsCollapseButton" class="${styles.feedbackbutton}" style="border-color: #e4341c; background-color: #e4341c; display: none;" 
        onclick="
        //TODO: Expand the document and reduce the comments
        document.getElementById('QuestionsButton').style.display = 'block';
        document.getElementById('QuestionsCollapseButton').style.display = 'none';
        document.getElementById('QuestionsContainer').style.display = 'none';
        "
          style="cursor:pointer;">
          <p>Collapse</p>
        </div>

        <div id="InlineButton" class="${styles.feedbackbutton}" onclick="
        document.getElementById('CommentsButton').style.display = 'block';
        document.getElementById('FormalButton').style.display = 'block';
        document.getElementById('InlineButton').style.display = 'none';
        document.getElementById('QuestionsButton').style.display = 'block';

        document.getElementById('QuestionsCollapseButton').style.display = 'none';
        document.getElementById('InlineCollapseButton').style.display = 'block';
        document.getElementById('FormalCollapseButton').style.display = 'none';
        document.getElementById('CommentsCollapseButton').style.display = 'none';

        document.getElementById('CommentsContainer').style.display = 'none';
        document.getElementById('InlineContainer').style.display = 'block';
        document.getElementById('FormalContainer').style.display = 'none';
        document.getElementById('QuestionsContainer').style.display = 'none';
        
        
        " style="cursor:pointer;">
          <p>In-line</p>
        </div>

        <div id="InlineCollapseButton" class="${styles.feedbackbutton}" style="border-color: #e4341c; background-color: #e4341c; display: none;" 
        onclick="
        //TODO: Expand the document and reduce the comments
        document.getElementById('InlineButton').style.display = 'block';
        document.getElementById('InlineCollapseButton').style.display = 'none';
        document.getElementById('InlineContainer').style.display = 'none';
        
        "
          style="cursor:pointer;">
          <p>Collapse</p>
        </div>

        <div id="FormalButton" class="${styles.feedbackbutton}" onclick="
        document.getElementById('FormalButton').style.display = 'none';
        document.getElementById('CommentsButton').style.display = 'block';
        document.getElementById('InlineButton').style.display = 'block';
        document.getElementById('QuestionsButton').style.display = 'block';

        document.getElementById('QuestionsCollapseButton').style.display = 'none';
        document.getElementById('InlineCollapseButton').style.display = 'none';
        document.getElementById('FormalCollapseButton').style.display = 'block';
        document.getElementById('CommentsCollapseButton').style.display = 'none';

        document.getElementById('CommentsContainer').style.display = 'none';
        document.getElementById('InlineContainer').style.display = 'none';
        document.getElementById('FormalContainer').style.display = 'block';
        document.getElementById('QuestionsContainer').style.display = 'none';
        
        " style="cursor:pointer;">
          <p>Formal</p>
        </div>
        <div id="FormalCollapseButton" class="${styles.feedbackbutton}" style="border-color: #e4341c; background-color: #e4341c; display: none;" 
        onclick="
        //TODO: Expand the document and reduce the comments
        document.getElementById('FormalButton').style.display = 'block';
        document.getElementById('FormalCollapseButton').style.display = 'none';
        document.getElementById('FormalContainer').style.display = 'none';
        
        "
          style="cursor:pointer;">
          <p>Collapse</p>
        </div>

        <div id="CommentsButton" class="${styles.feedbackbutton}" style="" onclick="
        document.getElementById('CommentsButton').style.display = 'none';
        document.getElementById('FormalButton').style.display = 'block';
        document.getElementById('InlineButton').style.display = 'block';
        document.getElementById('QuestionsButton').style.display = 'block';

        document.getElementById('QuestionsCollapseButton').style.display = 'none';
        document.getElementById('InlineCollapseButton').style.display = 'none';
        document.getElementById('FormalCollapseButton').style.display = 'none';
        document.getElementById('CommentsCollapseButton').style.display = 'block';

        document.getElementById('CommentsContainer').style.display = 'block';
        document.getElementById('InlineContainer').style.display = 'none';
        document.getElementById('FormalContainer').style.display = 'none';
        document.getElementById('QuestionsContainer').style.display = 'none';
        
        "
        style="cursor:pointer;">
          <p>Comments</p>
        </div>
        <div id="CommentsCollapseButton" class="${styles.feedbackbutton}" style="border-color: #e4341c; background-color: #e4341c; display: none;" 
        onclick="
        //TODO: Expand the document and reduce the comments
        document.getElementById('CommentsButton').style.display = 'block';
        document.getElementById('CommentsCollapseButton').style.display = 'none';
        document.getElementById('CommentsContainer').style.display = 'none';
        
        "
          style="cursor:pointer;">
          <p>Collapse</p>
        </div>

      </div>

    </div>
    </div>
`;
this._bindSave();
//TODO: pull writing item
this._renderWritingsAsync();
//TODO: pull document item
this._renderDocumentsAsync();
//TODO: pull feedback questions

//TODO: pull feedback answers

//TODO: pull feedback comments
this._renderCommentsAsync();
//TODO: pull feedback inlines

//TODO: pull formal feedbacks

  }

  private _bindSave():void{
    this.domElement.querySelector('#CommentsInputSend')?.addEventListener('click', ()=>{
      this.addCommentItem();
    })
  }

private addCommentItem(){
  var Title = "CFID-T";
  var Comment =(<HTMLInputElement>document.getElementById("CommentsInputField")).value;
  //var Comment = "Live test default"
  var CommenterID = "Tester"
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
  html+= ' style="width:100%; height: 100%;"> </iframe>';
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
  let html: string = '';
    items.forEach((item: ICommentListItem) => {
    html+='<div class="${styles.Answer}"> <img src="${require(';
    //TODO: fix the disappearing image bug; 
      html+="'../../shared/assets/person.png'";
      html+=')}" alt="" style="width: 100%; margin: 5%;">';
    html+= '<div><p>'+ item.UserID+'</p>';
    html+='<br><p>'+item.Comment+'</p>';
    html+='<br><p>'+item.Created+'</p></div></div>';
  });
  this.domElement.querySelector('#CommentsArea')!.innerHTML = html;
}




}
