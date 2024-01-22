
import styles from './DocumentFeedbackWebPart.module.scss';

export default class HTMLRenderer{

    public renderWritingContainer(): string{
        let html: string = ``;
html+=`<div id="WritingContainer" class="${styles.writinggrid}">
<div class="${styles.writingtitle}">
  <h1 id="TitleContainer">Writing title</h1>
</div>
`+this.renderDocumentContainer()+
`<div id="FeedbackArea" class="${styles.FeedbackArea}">
<div id="FeedbackContainer">
`+ this.renderComments() + this.renderInline() + this.renderFormal() + this.renderQuestions() +
`</div>
</div>
</div>

` + this.renderFeedbackButtons();
        return html;
    }

private renderFormal():string{
    let html : string = `<div id="FormalContainer" class="${styles.CommentContainer}" style="display:none;"> 
    <div id="Formaltitle">
    <h2 style="text-align: center;">Formal feedback:</h2>
    </div>
    <div class="${styles.AnswerArea}">
        <button type="button" class="${styles.collapsible}" style="background-color: #e4341c;"
        onclick="
        if(document.getElementById('TopsContent').style.display == 'none'){
            document.getElementById('TopsContent').style.display = 'block';
        }else{
            document.getElementById('TopsContent').style.display = 'none';
        }
        ">Tops</button>
        <div id="TopsContent" class="${styles.content}" style="display: none;">

        </div>
        <button type="button" class="${styles.collapsible}" style="background-color: #e4341c;"
        onclick="
        if(document.getElementById('TipsContent').style.display == 'none'){
            document.getElementById('TipsContent').style.display = 'block';
        }else{
            document.getElementById('TipsContent').style.display = 'none';
        }
        ">Tips</button>
        <div id="TipsContent" class="${styles.content}" style="display: none;">

        </div>
        <button type="button" class="${styles.collapsible}" style="background-color: #e4341c;"
        onclick="
        if(document.getElementById('NitpicksContent').style.display == 'none'){
            document.getElementById('NitpicksContent').style.display = 'block';
        }else{
            document.getElementById('NitpicksContent').style.display = 'none';
        }">Nitpicks</button>
        <div id="NitpicksContent" class="${styles.content}" style="display: none;">

        </div>
        <button type="button" class="${styles.collapsible}" style="background-color: #e4341c;"
        onclick="
        if(document.getElementById('GeneralContent').style.display == 'none'){
            document.getElementById('GeneralContent').style.display = 'block';
        }else{
            document.getElementById('GeneralContent').style.display = 'none';
        }">General impression</button>
        <div id="GeneralContent" class="${styles.content}" style="display: none;">

        </div>
        <button type="button" class="${styles.collapsible}" style="background-color: #e4341c;"
        onclick="
        if(document.getElementById('InputContent').style.display == 'none'){
            document.getElementById('InputContent').style.display = 'block';
        }else{
            document.getElementById('InputContent').style.display = 'none';
        }">Submit feedback</button>
        <div id="InputContent" class="${styles.content}" style="display: none;">
            <div style=" width: 100%;">
                <div >
                    <p>My tops:</p>
                    <textarea id="TopsInputField" type="text" style="margin-left: 5%;"></textarea>
                </div>
                <div>
                    <p>My tips:</p>
                    <textarea id="TipsInputField" type="text" style="margin-left: 5%;"></textarea>
                </div>
                <div>
                    <p>My nitpicks:</p>
                    <textarea id="NitpicksInputField" type="text" style="margin-left: 5%;"></textarea>
                </div>
                <div>
                    <p>My general impression:</p>
                    <textarea id="GeneralInputField" type="text" style="margin-left: 5%;"></textarea>
                </div>
            </div>
            <button id="FormalInputSend" style="float: right; margin-right: 10%;">
                Send
            </button>
        </div>
    
    </div>
    </div>`
    return html;
}

private renderQuestions():string{
    let html: string = `
    <div id="QuestionsContainer" class="${styles.CommentContainer}" style="display:none;"> 
        <div id="Questionstitle">
            <h2 style="text-align: center;">Feedback questions:</h2>
        </div>

        <div id="QAContainer" class="${styles.AnswerArea}">

            <button type="button" class="${styles.collapsible}" style="background-color: #e4341c;"
            onclick"
            if(document.getElementById('QuestionTest').style.display == 'none'){
                document.getElementById('QuestionTest').style.display = 'block';
            }else{
                document.getElementById('QuestionTest').style.display = 'none';
            }">Question 3</button>
            <div id="QuestionTest" class="${styles.content}" style=" display:none;">
                <div class="${styles.Answer}">
                    <p>My answer:</p>
                    <textarea type="text" style="margin-left: 5%;"></textarea>
                    <button style="float: right; margin-right: 10%;"><h1>></h1></button>
                </div>
            </div>
        </div>`;
    return html;
}

private renderInline():string{
    let html : string = `<div id="InlineContainer" style="display:none;"> 
    <div id="Inlinetitle">
    <h2 style="text-align: center;">Inline feedback:</h2>
    </div>
    <p>To Be Developed</p>
    </div>`;

    return html
}

private renderDocumentContainer(): string{
    let html : string = `<div class="${styles.writingmain}">
    <div id="DescContainer" class="${styles.writingdesc}"> Wrting description/summary/intro/author notes/written trigger warning</div>
    <div id="Documentcontainer" style="height: auto;">
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
  </div>`;

    return html
}

private renderComments():string{
    let html:string = `  
<div id="CommentsContainer" class="${styles.CommentContainer}" style="display:none;"> 
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
</div>`;
return html;
}

private renderFeedbackButtons():string{
    let html:string = ``;
    html+=`<div class="${styles.feedbackbuttons}">

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
    
      document.getElementById('WritingContainer').style.width = '60%';
      WritingContainer
    
      " style="cursor:pointer;">
      <p>Questions</p>
    </div>
    <div id="QuestionsCollapseButton" class="${styles.feedbackbutton}" style="border-color: #e4341c; background-color: #e4341c; display: none;" 
    onclick="
    //TODO: Expand the document and reduce the comments
    document.getElementById('QuestionsButton').style.display = 'block';
    document.getElementById('QuestionsCollapseButton').style.display = 'none';
    document.getElementById('QuestionsContainer').style.display = 'none';
    document.getElementById('WritingContainer').style.width = '95%';
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
    
    document.getElementById('WritingContainer').style.width = '60%';
    
    " style="cursor:pointer;">
      <p>In-line</p>
    </div>
    
    <div id="InlineCollapseButton" class="${styles.feedbackbutton}" style="border-color: #e4341c; background-color: #e4341c; display: none;" 
    onclick="
    //TODO: Expand the document and reduce the comments
    document.getElementById('InlineButton').style.display = 'block';
    document.getElementById('InlineCollapseButton').style.display = 'none';
    document.getElementById('InlineContainer').style.display = 'none';
    
    document.getElementById('WritingContainer').style.width = '95%';
    
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
    
    document.getElementById('WritingContainer').style.width = '60%';
    
    " style="cursor:pointer;">
      <p>Formal</p>
    </div>
    <div id="FormalCollapseButton" class="${styles.feedbackbutton}" style="border-color: #e4341c; background-color: #e4341c; display: none;" 
    onclick="
    //TODO: Expand the document and reduce the comments
    document.getElementById('FormalButton').style.display = 'block';
    document.getElementById('FormalCollapseButton').style.display = 'none';
    document.getElementById('FormalContainer').style.display = 'none';
    
    document.getElementById('WritingContainer').style.width = '95%';
    
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
    
    document.getElementById('WritingContainer').style.width = '60%';
    
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
    
    document.getElementById('WritingContainer').style.width = '95%';
    
    
    "
      style="cursor:pointer;">
      <p>Collapse</p>
    </div>
    
    </div>`
    return html;
    }

/*public renderExploreContainer():string{
    let html: string = ``;

    return html;
}*/

/*public renderFilterContainer():string{
    let html: string = ``;

    return html;
}*/

/*public renderDetailContainer():string{
    let html: string = ``;

    return html;
}*/

}