import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './ExploreWebPart.module.scss';

import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

//var Writinglist: IWritingListItem[] =[];

export interface IExploreWebPartProps {
}

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

  First_placed: Date;
  Last_update: Date;

  Views: number;
  Feedback_received: number;

  Triggers: string;
  Genres: string;
  Tags: string;
  Reference: string; //Collections-> singlesID & Singles -> versionID
}

export interface debug {
  Debug: string;
}

export default class ExploreWebPart extends BaseClientSideWebPart<IExploreWebPartProps> {

  writingItems : IWritingListItem[];
  Selected: IWritingListItem;


  public render(): void {
    this.domElement.innerHTML = `<div class="${styles.maincontainer}">
    
    <div class="${styles.gridcontainer}">

    <div class="${styles.item1}">
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
      <div class="${styles.item3}">
        <div id="WritingListContainer" class="${styles.exploreContainer} ">
        </div>
        <div id="DetailMenu" class="${styles.detailcontainer}" style="height: 0%; font-size: 16px;">
`/*
  <p>Details:</p>
  <div class="${styles.detailcontainer}">
    <div id:"BaseInfo" class="${styles.detailitem}">

  
    </div>
    <div id:"statistics" class="${styles.detailitem}">
    </div>
    <div id:"TnT" class="${styles.detailitem}">

    </div>


        </div>*/+`
      </div>
    </div>
  <button id="DetailsCloseButton"
  class="detailscloseButton" onclick="
  document.getElementById('WritingListContainer').style.height = '100%';
  document.getElementById('DetailMenu').style.height = '0%';
  document.getElementById('DetailsCloseButton').style.display = 'none';
  ">X</button>
    
    `;
    this._renderAllFilters();
    this._renderWritingsAsync();


  }


  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
/*
private _renderDetailsAsync(WritingID: string){
        this._getDetailsData(id)
      .then((response) => {
        this._renderDetails(response.value);
      })
      .catch(() => { });

}
*/
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
/*
private _getDetailsData(WritingID :string):Promise<IWritingList>{
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Writings')/items?$filter=(Title Eq `+WritingID+`) $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
  .then((response: SPHttpClientResponse) => {
    return response.json();
  })
  .catch(() => { return });
}

private _renderBruteDetails():void{
  let html = '<p style="font-weight: bolder;">Base information</p>';
  html+=`<p>Title: </p>
  <p>Author: </p>
  <p>post-date: </p>
  <p>writing type: </p>
  <p>genres: </p>
  <ul>
    <li></li>
    <li>TODO:list the genres dynamically</li>
  </ul>
  <p>state: </p>
`;
  if (this.domElement.querySelector('#BaseInfo') != null) {
    this.domElement.querySelector('#BaseInfo')!.innerHTML = html;
  };
  html = `<p style="font-weight: bolder;">Statistics</p>`;
  html+=`      
  <p>Views: </p>
  <p>Feedback given: </p>
`;
  if (this.domElement.querySelector('#statistics') != null) {
    this.domElement.querySelector('#statistics')!.innerHTML = html;
  };
  html = `<p style="font-weight: bolder;">Tags & triggers</p>
  <p style="font-weight: bolder;">Tags</p>`;
  html+=`      
  <ul>
    <li></li>
    <li>TODO:list the tags dynamically</li>
  </ul>
  <p style="font-weight: bolder;">Triggers</p>
  <ul>
    <li></li>
    <li>TODO:list the triggers dynamically</li>
    <li>Tigger3</li>
  </ul>
`;
  if (this.domElement.querySelector('#TnT') != null) {
    this.domElement.querySelector('#TnT')!.innerHTML = html;
  };
}

private _renderDetails(items: IWritingListItem[]):void{
  var item = items[0];
  let html = '<p style="font-weight: bolder;">Base information</p>';
  html+=`<p>Title: ${item.Writingtitle}</p>
  <p>Author: ${item.Owner}</p>
  <p>post-date: ${item.First_placed}</p>
  <p>writing type: ${item.Writingtype}</p>
  <p>genres: </p>
  <ul>
    <li>${item.Genres}</li>
    <li>TODO:list the genres dynamically</li>
  </ul>
  <p>state: ${item.Writingstate}</p>
`;
  if (this.domElement.querySelector('#BaseInfo') != null) {
    this.domElement.querySelector('#BaseInfo')!.innerHTML = html;
  };
  html = `<p style="font-weight: bolder;">Statistics</p>`;
  html+=`      
  <p>Views: ${item.Views}</p>
  <p>Feedback given: ${item.Feedback_received}</p>
`;
  if (this.domElement.querySelector('#statistics') != null) {
    this.domElement.querySelector('#statistics')!.innerHTML = html;
  };
  html = `<p style="font-weight: bolder;">Tags & triggers</p>
  <p style="font-weight: bolder;">Tags</p>`;
  html+=`      
  <ul>
    <li>${item.Tags}</li>
    <li>TODO:list the tags dynamically</li>
  </ul>
  <p style="font-weight: bolder;">Triggers</p>
  <ul>
    <li>${item.Triggers}</li>
    <li>TODO:list the triggers dynamically</li>
    <li>Tigger3</li>
  </ul>
`;
  if (this.domElement.querySelector('#TnT') != null) {
    this.domElement.querySelector('#TnT')!.innerHTML = html;
  };
}
*/
  private _renderWritingsAsync() {
    this._getWritingsListdata()
      .then((response) => {
        this._renderWritingsList(response.value);
      })
      .catch(() => { });
  }

  private _getWritingsListdata(): Promise<IWritingList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Writings')/items? $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
    }
  private _renderWritingsList(items: IWritingListItem[]): void {
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
                        html+='<p>post-date: ${item.First_placed}</p>';
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
                        html+='<p>Feedback given: ${item.Feedback_received}</p>';
                  
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
                        document.getElementById('DetailMenu').innerHTML = html;

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