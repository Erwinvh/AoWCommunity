import styles from '././ExploreWebPart.module.scss';

export default class HTMLRenderer{

  //Render method to construct the writing screen for the reading and feedbacking of a document/writing. 
  //This code portion contains the public function to get the html portion of the code for this webpart.
  // - Parameter: None
  // - Returns:   A string containing the HTML code for the reading and feedbacking area of the explore webpart
  // - Example:   This method is called on a new webpart for the explore page and should only be called once per instance of the webpart.
  public renderWritingContainer(): string{
    let html: string = ``;
    html+=`
      <div id="WritingOverviewContainer" style="display:none;">
        <div id="WritingContainer" class="${styles.writinggrid}">
          <div class="${styles.writingtitle}">
            <button id="DocumentBackButton" class="${styles.backButtons}">Back</button>
            <h1 id="TitleContainer">Writing title</h1>
        </div>`
        +this.renderDocumentContainer()
        +`<div id="FeedbackArea" class="${styles.FeedbackArea}">
            <div id="FeedbackContainer">`
              + this.renderComments() 
              + this.renderInline() 
              + this.renderFormal() 
              + this.renderQuestions() 
            +`</div>
          </div>
        </div>` 
        + this.renderFeedbackButtons()
      +`</div>`
    return html;
  }

  //Private part render method to construct the formal feedbacking area of the documentfeedbacking code. 
  // - Parameter: None
  // - Returns:   A string containing the HTML code for the formal feedbacking area of the explore webpart
  // - Example:   This method is called in the renderWritingContainer function.
  // - TODO:      The feedback settings are not fully functional as of right now.
  private renderFormal():string{
      const html : string = `<div id="FormalContainer" class="${styles.CommentContainer}" style="display:none;"> 
      <div id="Formaltitle">
      <h2 style="text-align: center;">Formal feedback</h2>
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
                      <p>My tops</p>
                      <textarea id="TopsInputField" type="text" style="max-width:80%; width:80%; min-width:80%; margin-left: 5%;"></textarea>
                  </div>
                  <div>
                      <p>My tips</p>
                      <textarea id="TipsInputField" type="text" style="max-width:80%; width:80%; min-width:80%; margin-left: 5%;"></textarea>
                  </div>
                  <div>
                      <p>My nitpicks</p>
                      <textarea id="NitpicksInputField" type="text" style="max-width:80%; width:80%; min-width:80%; margin-left: 5%;"></textarea>
                  </div>
                  <div>
                      <p>My general impression</p>
                      <textarea id="GeneralInputField" type="text" style="max-width:80%; width:80%; min-width:80%; margin-left: 5%;"></textarea>
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

  //Private part render method to construct the questions and answers feedbacking area of the documentfeedbacking code. 
  // - Parameter: None
  // - Returns:   A string containing the HTML code for the questions and answers feedbacking area of the explore webpart
  // - Example:   This method is called in the renderWritingContainer function.
  // - TODO:      The feedback settings are not fully functional as of right now.
  private renderQuestions():string{
      const html: string = `
      <div id="QuestionsContainer" class="${styles.CommentContainer}" style="display:none;"> 
        <div id="Questionstitle">
            <h2 style="text-align: center;">Feedback questions</h2>
        </div>

        <div id="QAContainer" class="${styles.AnswerArea}">
        </div>`;
      return html;
  }

  //Private part render method to construct the inline feedbacking area of the documentfeedbacking code. 
  // - Parameter: None
  // - Returns:   A string containing the HTML code for the inline feedbacking area of the explore webpart
  // - Example:   This method is called in the renderWritingContainer function.
  // - TODO:      Construct the actual HTML code for the inline feedabcking area as this is a placeholder.
  // - TODO:      The feedback settings are not fully functional as of right now.
  private renderInline():string{
      const html : string = `<div id="InlineContainer" style="display:none;"> 
        <div id="Inlinetitle">
          <h2 style="text-align: center;">Inline feedback</h2>
        </div>
        <p>To Be Developed</p>
      </div>`;

      return html
  }

  //Private render method to construct the document view area of the documentfeedbacking code.
  // - Parameter: None
  // - Returns:   A string containing the HTML code for the document viewing area of the document viewing and feedbacking part of the explore webpart.
  // - Example:   This method is called in the renderWritingContainer function.
  // - TODO:      If applicable link the relevant collection, previous chapter/work and next chapter/work. See TODO's in method.
  private renderDocumentContainer(): string{
    const html : string = `<div class="${styles.writingmain}">
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
          <div>`
          //TODO: have this link to the previous chapter
          +`<h3>Previous chapter/work</h3>
            Previous chapter name (TBD)
          </div>
          <div>`
          //TODO: have this link to the Collection
          +`<h3>Collection</h3>
            <a>Collection name</a>
          </div>
          <div>`
          //TODO: have this link to the next chapter
          +`<h3>Next chapter/work</h3>
            Next chapter name (TBD)
          </div>
        </div>
      </div>
    </div>`;

    return html
  }

  //Private part render method to construct the comments feedbacking area of the documentfeedbacking code. 
  // - Parameter: None
  // - Returns:   A string containing the HTML code for the comments feedbacking area of the explore webpart
  // - Example:   This method is called in the renderWritingContainer function.
  // - TODO:      The feedback settings are not fully functional as of right now.
  private renderComments():string{
      const html:string = `  
  <div id="CommentsContainer" class="${styles.CommentContainer}" style="display:none;"> 
  <div id="commentstitle">
    <h2 style="text-align: center;">Comments</h2>
  </div>
  <div id="CommentsArea" class="${styles.AnswerArea}">
      
  </div>
  <div id="CommentsInput">
    <br>
    <textarea id="CommentsInputField" style="max-width:80%; width:80%; min-width:80%;">
    </textarea>
    <button id="CommentsInputSend" onclick="addCommentItem();">Send</button>
  </div>
  </div>`;
  return html;
  }

  //Private render method to construct the collapse and expand feedback area buttons for the feedbacking of a document/writing. 
  // - Parameter: None
  // - Returns:   A string containing the HTML code for the expand and collapse buttons for the feedback options of the explore webpart.
  // - Example:   This method is called on a new webpart for the explore page and should only be called once per instance of the webpart.
  // - TODO:      This method could be either split made more efficient by rendering the buttons dynamically
  private renderFeedbackButtons():string{
    const html:string = `
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
      
          document.getElementById('WritingContainer').style.width = '60%';
          " style="cursor:pointer;">
          <p>Questions</p>
        </div>
        <div id="QuestionsCollapseButton" class="${styles.feedbackbutton}" style="border-color: #e4341c; background-color: #e4341c; display: none;" 
          onclick="
          document.getElementById('QuestionsButton').style.display = 'block';
          document.getElementById('QuestionsCollapseButton').style.display = 'none';
          document.getElementById('QuestionsContainer').style.display = 'none';
          document.getElementById('WritingContainer').style.width = '95%';
          " style="cursor:pointer;">
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
          document.getElementById('InlineButton').style.display = 'block';
          document.getElementById('InlineCollapseButton').style.display = 'none';
          document.getElementById('InlineContainer').style.display = 'none';
      
          document.getElementById('WritingContainer').style.width = '95%';
          " style="cursor:pointer;">
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
          document.getElementById('FormalButton').style.display = 'block';
          document.getElementById('FormalCollapseButton').style.display = 'none';
          document.getElementById('FormalContainer').style.display = 'none';
      
          document.getElementById('WritingContainer').style.width = '95%';
          " style="cursor:pointer;">
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
          " style="cursor:pointer;">
          <p>Comments</p>
        </div>

        <div id="CommentsCollapseButton" class="${styles.feedbackbutton}" style="border-color: #e4341c; background-color: #e4341c; display: none;" 
          onclick="
          document.getElementById('CommentsButton').style.display = 'block';
          document.getElementById('CommentsCollapseButton').style.display = 'none';
          document.getElementById('CommentsContainer').style.display = 'none';
      
          document.getElementById('WritingContainer').style.width = '95%';
          " style="cursor:pointer;">
          <p>Collapse</p>
        </div>

      </div>`
    return html;
  }

  //Public render method to construct the document/writing exploration area for the explore webpart. 
  // - Parameter: None
  // - Returns:   A string containing the HTML code for the exploration area of the explore webpart.
  // - Example:   This method is called when making a new exploration webpart and should only be called once per instance of the webpart.
  public renderExploreContainer():string{
    const html: string = `
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

  //Private render part method to construct the container that will contain the public writings icons. 
  // - Parameter: None
  // - Returns:   A string containing the HTML code for the writing icon container of the explore webpart.
  // - Example:   This method is called when making a new exploration webpart and should only be called once per instance of the webpart.
  private renderExploreOverviewContainer():string{
      const html: string = `
      <div id="WritingListContainer" class="${styles.exploreContainer} ">
      </div>`;
      return html;
  }

  //Private render part method to construct the "sort by" bar and the search bar used by the members to increase the search speed in the exploration menu. 
  // - Parameter: None
  // - Returns:   A string containing the HTML code for the search bar and "sort by" bar of the explore webpart.
  // - Example:   This method is called when making a new exploration webpart and should only be called once per instance of the webpart.
  // - TODO:      While the HTML is mostly correct some CSS may still be neceassary 
  // - TODO:      There is no function connected to the two bars.
  private renderSortBar(): string{
    const html: string = `
    <div class="${styles.item1}">
    <p style="margin :0% 2%; float: left;">Writers in town </p>
      <div style="float: left;">
        <label for="cars">Sort by </label>
        <select id="cars" name="cars">
          <option value="volvo">Newest</option>
          <option value="saab">Oldest</option>
          <option value="fiat">Most viewed</option>
          <option value="audi">Least viewed</option>
          <option value="audi">Most feedbacked</option>
          <option value="audi">Least feedbacked</option>
        </select>
      </div>
      <div class="${styles.searchContainer}" style="float: right;">
        <form action="/action_page.php">
          <input type="text" placeholder="Search.." name="search">
        </form>
      </div>
    </div>`;
    return html;
  }

  //Private render part method to construct the filters bar and the search bar used by the members to increase the search speed in the exploration menu. 
  // - Parameter: None
  // - Returns:   A string containing the HTML code for the filter containers of the filters and some of the static filters of the explore webpart.
  // - Example:   This method is called when making a new exploration webpart and should only be called once per instance of the webpart.
  // - TODO:      The entire filter bar should collapse in a similar way as the feedback expand and collapse buttons used in renderFeedbackButtons()
  //              This will require a serious redesign of the HTML of the webpart, take this into consideration wwhen making this change. 
  //              (Change requested close to the end of the project developement fase)
  // - TODO:      While the HTML is mostly correct some CSS may still be neceassary.
  // - TODO:      There is no function connected to the filters, these need to be written.
  // - TODO:      Some filters are hardcoded such as type and state, consider whether they should function as the other filters or whether these should be static.
  private renderFilterContainer():string{
    const html: string = `
      <div class="${styles.item2} ${styles.filtercontainer}">
        <h5>Filters</h5>
        
        <button type="button" class="${styles.collapsible}" style="background-color: #807d7d;"
            onclick="
            if(document.getElementById('WritingTypeCollapsable').style.display == 'none'){
              document.getElementById('WritingTypeCollapsable').style.display = 'block';
            }else{
              document.getElementById('WritingTypeCollapsable').style.display = 'none';
            }"><h6>Writing type</h6></button>
        <div id="WritingTypeCollapsable" class="${styles.content}" style=" display:none;">
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
        </div>
        <button type="button" class="${styles.collapsible}" style="background-color: #807d7d;"
          onclick="
          if(document.getElementById('WritingStateCollapsable').style.display == 'none'){
            document.getElementById('WritingStateCollapsable').style.display = 'block';
          }else{
            document.getElementById('WritingStateCollapsable').style.display = 'none';
          }"><h6>Writing stage</h6></button>
        <div id="WritingStateCollapsable" class="${styles.content}" style=" display:none;">
          <form class="${styles.filter}">
            <input type="checkbox" id="Type1" name="Type1" value="Fiction">
            <label for="Type1">First draft</label><br>
            <input type="checkbox" id="Type2" name="Type2" value="Non-fiction">
            <label for="Type2">Review version</label><br>
            <input type="checkbox" id="Type3" name="Type3" value="Poetry">
            <label for="Type3">Finished/final</label><br>
          </form>
        </div>

        <button type="button" class="${styles.collapsible}" style="background-color: #807d7d;"
          onclick="
          if(document.getElementById('WritingGenreCollapsable').style.display == 'none'){
            document.getElementById('WritingGenreCollapsable').style.display = 'block';
          }else{
            document.getElementById('WritingGenreCollapsable').style.display = 'none';
          }"><h6>Genres</h6></button>
        <div id="WritingGenreCollapsable" class="${styles.content}" style=" display:none;">
          <form id="GenreListContainer" class="${styles.filter}">
          </form>
        </div>
        
        <button type="button" class="${styles.collapsible}" style="background-color: #807d7d;"
          onclick="
          if(document.getElementById('WritingTagCollapsable').style.display == 'none'){
            document.getElementById('WritingTagCollapsable').style.display = 'block';
          }else{
            document.getElementById('WritingTagCollapsable').style.display = 'none';
          }"><h6>Tags</h6></button>
        <div id="WritingTagCollapsable" class="${styles.content}" style=" display:none;">
          <form id="TagListContainer" class="${styles.filter}">
          </form>
        </div>

        <button type="button" class="${styles.collapsible}" style="background-color: #807d7d;"
          onclick="
          if(document.getElementById('WritingTriggerCollapsable').style.display == 'none'){
            document.getElementById('WritingTriggerCollapsable').style.display = 'block';
          }else{
            document.getElementById('WritingTriggerCollapsable').style.display = 'none';
          }"><h6>Included Trigger</h6></button>
        <div id="WritingTriggerCollapsable" class="${styles.content}" style=" display:none;">
          <form id="TriggerListContainer" class="${styles.filter}">
          </form>
        </div>
        <div style="height:40%"></div>
      </div>`;
    return html;
  }

  //Private render part method to construct the detail pop-up box and the button to close the box in the exploration menu. 
  //This will be used by the users to quickly see the details of a writing that can't be fit in the icons. 
  // - Parameter: None
  // - Returns:   A string containing the HTML code for the details pop-up viewcontainer of a document/collection or writing of the explore webpart.
  // - Example:   This method is called when making a new exploration webpart and should only be called once per instance of the webpart.
  // - TODO:      Consider making this an "actual" pop-up box overlaying the webpart.
  private renderDetailContainer():string{
    const html: string = `
      <div id="DetailMenu" class="${styles.detailcontainer}" style="height: 0%; font-size: 16px;">
          <button id="DetailsCloseButton"
              class="detailscloseButton" style="display: none;" onclick="
                  document.getElementById('WritingListContainer').style.height = '100%';
                  document.getElementById('DetailMenu').style.height = '0%';
                  document.getElementById('DetailsCloseButton').style.display = 'none';
          ">X</button>
          <div id="DetailMenuInfo" class="${styles.detailcontainerInfo}">
          </div>
      </div>`;
    return html;
  }

  //Public render method to construct the detail overview of a writing or collection in the exploration menu. 
  //This will be used by the users to see the details of a writing and the navigation to the versions or singles of a single or collection respectively. 
  // - Parameter: A String which should only be given the value of either "Collection" or "Single".
  // - Returns:   A string containing the HTML code for the details overview of a document/collection or writing of the explore webpart.
  // - Example:   This method is called when making a new exploration webpart and can be called multiple times per instance of the webpart.
  // - TODO:      Consider bringing this and related functions to the SharedHTMLRenderer when/if it is also implemented in the My writings webpart
  public RenderWritingpieceOverview(Type: string):string{
    const html: string = `
      <div id="`+Type+`Overview" style="display:none;">
        <button id="`+Type+`BackButton" class="${styles.backButtons}">Back</button>
        <h1 id="`+Type+`TitleField" style="text-align: center;">Title collection piece work</h1>
        <div class="${styles.topgrid}">
          <div class="${styles.uppergrid}">
            <div class="${styles.lowergrid}">
              <div class="${styles.descriptionitem}">`
                +this.RenderDescription(Type)
              +`</div>`
              +this.RenderSubDivisionTable(Type)
            +`</div>
            <div>`
              +this.RenderBaseStatTable(Type)
              +this.RenderTriggersList(Type)
              +this.RenderTagsList(Type)
            +`</div>
          </div>`
              +this.RenderLatestButton(Type)
        +`</div>
      </div>`
    return html;
  }

  //Private render part method to construct the description of a writing/collection in the details overview of the exploration menu. 
  //Lorem ipsum is the placeholder and will be used if the pulled data has been placed incorrectly. 
  // - Parameter: A String which should only be given the value of either "Collection" or "Single".
  // - Returns:   A string containing the HTML code for the description of a document/collection or writing of the writingoverview.
  // - Example:   This method is called when making a new exploration webpart and should only be called once per instance of the RenderWritingpieceOverview() function.
  private RenderDescription(Type: string):string {
    const html:string = `
      <h3>Description</h3>
      <pre id="`+Type+`OverviewDesc" style="text-align: center; white-space: pre-line; height: fit-content;">
        Lorem ipsum dolor sit amet, 
        consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 

        Ut enim ad minim veniam, 
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
        Excepteur sint occaecat cupidatat non proident, 
        sunt in culpa qui officia deserunt mollit anim id est laborum.
      </pre>`;
    return html;
  }

  //Private render part method to construct the quick select button for a writing/version in the details overview of the exploration menu.
  //This button is a quick select button to get the most recent addition to a collection or single. 
  // - Parameter: A String which should only be given the value of either "Collection" or "Single".
  // - Returns:   A string containing the HTML code for the latestbutton of a document/collection or writing of the writingoverview.
  // - Example:   This method is called when making a new exploration webpart and should only be called once per instance of the RenderWritingpieceOverview() function.
  private RenderLatestButton(Type: string):string {
    let html:string = ``;
    if(Type === "Collection"){
      html+=`    
      <button id="latestSingleRedirectButton" data-Latest="NA">
      Go to latest version &rarr;
      </button>`
    }else{
      html+=`    
      <button id="latestVersionRedirectButton">
      Go to latest version &rarr;
      </button>`
    }
    return html;
  }

  //Private render part method to construct the menu for the subdivisional writings in the details overview of the exploration menu.
  //This menu contains the singles of a collection or the versions of a single based off of the parameter.
  // - Parameter: A String which should only be given the value of either "Collection" or "Single".
  // - Returns:   A string containing the HTML code for the subdivision table of a document/collection or writing of the writingoverview.
  // - Example:   This method is called when making a new exploration webpart and should only be called once per instance of the RenderWritingpieceOverview() function.
  private RenderSubDivisionTable(Type: string): string{
    const html:string = `
      <div class="${styles.descriptionitem}">
        <h3 id="`+Type+`SubdivisionTitle">Chapters/components</h3>
        <table id="`+Type+`SubdivisionTable">
          <tr>
            <th>Chapter/component</th>
            <th>Date</th>
            <th>Link</th>
          </tr>
        </table>
      </div>`;
    return html;
  }

  //Private render part method to construct the menu for the basic statsistics area of a writing/collection in the details overview of the exploration menu.
  //This table contains the information about the collection/writing such as the author, dates and the writing type.
  // - Parameter: A String which should only be given the value of either "Collection" or "Single".
  // - Returns:   A string containing the HTML code for the basic statistics table of a document/collection or writing of the writingoverview.
  // - Example:   This method is called when making a new exploration webpart and should only be called once per instance of the RenderWritingpieceOverview() function.
  private RenderBaseStatTable(Type: string):string{
    const html: string = `
      <h3>Base statistics</h3>
        <table>
          <tr>
            <th>Statistic</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Author(s)</td>
            <td id="`+Type+`OwnerField">100</td>
          </tr>
          <tr>
            <td>Views</td>
            <td id="`+Type+`ViewField">100</td>
          </tr>
          <tr>
            <td>Feedbackers</td>
            <td id="`+Type+`FeedbackersField">5</td>
          </tr>
          <tr>
            <td>Likes</td>
            <td>NA</td>
          </tr>
          <tr>
            <td>First version release date</td>
            <td id="`+Type+`FirstVersionDateField">2 months ago</td>
          </tr>
          <tr>
            <td>Newest version release date</td>
            <td id="`+Type+`LastUpdateField">Today</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>`+Type+`</td>
          </tr>
          <tr>
            <td>Genre</td>
            <td id="`+Type+`GenreField">Test document</td>
          </tr>
        </table>`;
    return html;
  }

  //Private render part method to construct the list of tags within the collection/writing in the details overview of the exploration menu.
  //This menu contains the information regarding literairy tags used for easier searching that may be applicable.
  // - Parameter: A String which should only be given the value of either "Collection" or "Single".
  // - Returns:   A string containing the HTML code for the tag listing of a document/collection or writing of the writingoverview.
  // - Example:   This method is called when making a new exploration webpart and should only be called once per instance of the RenderWritingpieceOverview() function.
  private RenderTagsList(Type: string): string{
    const html:string = `
      <h3>Tags</h3>
      <ul>
          <li id="`+Type+`TagsField">Tag1</li>
      </ul>`;
    return html;
  }

  //Private render part method to construct the list of trigger warnings within the collection/writing in the details overview of the exploration menu.
  //This menu contains the information regarding trigger warnings that may be applicable.
  // - Parameter: A String which should only be given the value of either "Collection" or "Single".
  // - Returns:   A string containing the HTML code for the trigger listing of a document/collection or writing of the writingoverview.
  // - Example:   This method is called when making a new exploration webpart and should only be called once per instance of the RenderWritingpieceOverview() function.
  private RenderTriggersList(Type: string): string{
    const html:string = `
      <h3>Content triggers</h3>
      <ul>
          <li id="`+Type+`TriggersField">Tigger1</li>
      </ul>`;
    return html;
  }

}