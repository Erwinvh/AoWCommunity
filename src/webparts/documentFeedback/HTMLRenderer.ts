
import styles from './DocumentFeedbackWebPart.module.scss';

export default class HTMLRenderer{

public renderWritingContainer(): string{
        let html: string = ``;
html+=`
<div id="WritingOverviewContainer" style="display:none;">
<div id="WritingContainer" class="${styles.writinggrid}">
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

` + this.renderFeedbackButtons()
+`</div>`
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



public renderExploreContainer():string{
    let html: string = `
        <div id = "ExploreContainer" class="${styles.gridcontainer}" style="display:grid;">`
          +this.renderSortBar()
          +this.renderFilterContainer()
          +`<div class="${styles.item3}">`
          +this.renderExploreOverviewContainer()
          +this.renderDetailContainer()
          +`</div>`
        +`</div>`;

    return html;
}

private renderExploreOverviewContainer():string{
    let html: string = `
    <div id="WritingListContainer" class="${styles.exploreContainer} ">
    </div>
    `;

    return html;
}

private renderSortBar(): string{
    let html: string = `
    <div class="${styles.item1}">
    <p style="margin :0% 2%; float: left;">Writers in town </p>
      <div style="float: left;">
        <label for="cars">Sort by: </label>
        <select id="cars" name="cars">
          <option value="volvo">Newest</option>
          <option value="saab">Oldest</option>
          <option value="fiat">Most viewed</option>
          <option value="audi">Least viewed</option>
          <option value="audi">Most feedbacked</option>
          <option value="audi">Least feedbacked</option>
        </select>
      </div>
      <div class="${styles.searchcontainer}" style="float: right;">
        <form action="/action_page.php">
          <input type="text" placeholder="Search.." name="search">
        </form>
      </div>

    </div>
    `;

    return html;
}

private renderFilterContainer():string{
    let html: string = `
    <div class="${styles.item2, styles.filtercontainer}">

      <h3>Filters:</h3>

      <h4>Writing type:</h4>
      <p id="Debugger"></p>
      <form class="${styles.filter}">
        <input type="checkbox" id="Type1" name="Type1" value="Fiction">
        <label for="Type1">Fiction <img src="${require('../../shared/assets/fiction.png')}" style="height: 10%; width: 10%;"></label><br>
        <input type="checkbox" id="Type2" name="Type2" value="Non-fiction">
        <label for="Type2">Non-fiction <img src="${require('../../shared/assets/nonfiction.png')}"
            style="height: 10%; width: 10%;"></label><br>
        <input type="checkbox" id="Type3" name="Type3" value="Poetry">
        <label for="Type3">Poetry <img src="${require('../../shared/assets/poetry.png')}" style="height: 10%; width: 10%;"></label><br>
        <input type="checkbox" id="Type4" name="Tytpe4" value="Script">
        <label for="Type4">Scripts <img src="${require('../../shared/assets/script.png')}" style="height: 10%; width: 10%;"></label><br>
        <input type="checkbox" id="Type5" name="Type5" value="Other">
        <label for="Type5">Other <img src="${require('../../shared/assets/otherwriting.png')}" style="height: 10%; width: 10%;"></label>
      </form>

      <h4>Writing stage:</h4>
      <form class="${styles.filter}">
        <input type="checkbox" id="Type1" name="Type1" value="Fiction">
        <label for="Type1">First draft</label><br>
        <input type="checkbox" id="Type2" name="Type2" value="Non-fiction">
        <label for="Type2">Review version</label><br>
        <input type="checkbox" id="Type3" name="Type3" value="Poetry">
        <label for="Type3">Finished/final</label><br>
      </form>
      <div id="GenreListContainer">
      </div>
        <div id="TagListContainer">
        </div>
        <div id="TriggerListContainer">
        </div>
        
      </div>
    `;

    return html;
}

private renderDetailContainer():string{
    let html: string = `
    <div id="DetailMenu" class="${styles.detailcontainer}" style="height: 0%; font-size: 16px;">
        <button id="DetailsCloseButton"
            class="detailscloseButton" style="display: none;" onclick="
                document.getElementById('WritingListContainer').style.height = '100%';
                document.getElementById('DetailMenu').style.height = '0%';
                document.getElementById('DetailsCloseButton').style.display = 'none';
        ">X</button>
        <div id="DetailMenuInfo" class="${styles.detailcontainerInfo}">
        </div>
    </div>
    `;
return html;
}




public renderMemberBar():string{
  let html: string = `
  <div>
  
  <ul class="${styles.memberBar}">
  <li><a class="${styles.active}" href="explore.html"><img draggable="false" src="${require('../../shared/assets/explore.png')}" alt="Explore writing function"><br>Writers in town</a></li>
  <li><a href="mywriting.html"><img draggable="false" src="${require('../../shared/assets/writing.png')}" alt="Owned writing overview"><br>My writing</a></li>
  <li><a href="myfeedback.html"><img draggable="false" src="${require('../../shared/assets/chat.png')}" alt="Chat overview"><br>My chats</a></li>
  <li><a href="following.html"><img draggable="false" src="${require('../../shared/assets/following.png')}" alt="Follwoed writers overview"><br>Followed writers</a></li>
  <li><a href="mynotifications.html"><img draggable="false" src="${require('../../shared/assets/notification.png')}" alt="nitifications overview"><br>Notifications</a></li>
  <li><a href="myteams.html"><img draggable="false" src="${require('../../shared/assets/team.png')}" alt="Joined teams overview"><br>Teams</a></li>
  <li><a href="material.html"><img draggable="false" src="${require('../../shared/assets/material.png')}" alt="Writing materials overview"><br>Writing material</a></li>
  <li><a href="forums.html"><img draggable="false" src="${require('../../shared/assets/forum.png')}" alt="Forum"><br>Forum</a></li>

</ul>
  
  </div>
  `;

  return html;
}

}