import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
//import { escape } from '@microsoft/sp-lodash-subset';

import styles from './TbdContainerWebPart.module.scss';
import * as strings from 'TbdContainerWebPartStrings';
import HTMLRenderer from './HTMLRenderer';

import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

export interface ITbdContainerWebPartProps {
  description: string;
  title: string;
}

export interface ISingleList {
  value: ISingleListItem[]
}

export interface ISingleListItem {
  Title: string;
  SingleID: string;
  AuthorID: string;
  Created: Date;
}

export interface IVersionList {
  value: IVersionListItem[]
}

export interface IVersionListItem {
  Title: string;
  SingleID: string;
  DocumementID: string;
  Created: Date;
  VersionName: string;
}

export interface ICollectionList {
  value: ICollectionListItem[]
}

export interface ICollectionListItem {
  Title: string;
  CollectionID: string;
  OwnerID: string;
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

export default class TbdContainerWebPart extends BaseClientSideWebPart<ITbdContainerWebPartProps> {
  public render(): void {
    let htmlRenderer = new HTMLRenderer
    this.domElement.innerHTML = `<div class="${styles.maincontainer}">

  `
  +htmlRenderer.RenderCollectionOverview()
  +htmlRenderer.RenderSingleOverview()
+`</div>`;
this._renderWritingsAsync('WID-1');
  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: "Group",
              groupFields: [
                PropertyPaneTextField('title', {
                  label: 'Title'
                }),
                PropertyPaneTextField('description', {
                  label: 'Description',
                  multiline: true
                })
              ]
            }
          ]
        }
      ]
    };
  }

  //TODO: pull writing based on WID and set the values necessary


  //TODO: check for collection or single and pull CID or SID, set the page as is required


  //TODO: if SID then pull from versions as links, if CID then pull from singles

  //TODO:Double up the screen, one for Collection and one for single. back button is a nice to have feature

private _renderWritingsAsync(WID: string) {
    this._getWritingsListdata(WID)
      .then((response) => {
        this._renderWriting(response.value);
      })
      .catch(() => { });
  }

  private _getWritingsListdata(WID: string): Promise<IWritingList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Writings')/items?$filter= Title eq '`+WID+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
    }
  private _renderWriting(items: IWritingListItem[]): void {
    let item = items[0];

    if(item.WorkType == "Collection"){

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
    //TODO: shift to the latest single overview

    }else{
      (<HTMLElement>this.domElement.querySelector('#CollectionOverview')).style.display = "none";
      (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "block";
      this.domElement.querySelector('#SingleOverviewDesc')!.innerHTML = item.Description;
      this.domElement.querySelector('#SingleTitleField')!.innerHTML = item.Writingtitle;
  
      this.domElement.querySelector('#SingleOwnerField')!.innerHTML = item.Owner;
      this.domElement.querySelector('#SingleViewField')!.innerHTML = item.Views.toString();
      this.domElement.querySelector('#SingleFirstVersionDateField')!.innerHTML = item.FirstPosted.toDateString();
      this.domElement.querySelector('#SingleLastUpdateField')!.innerHTML = item.LastUpdated.toDateString();
      this.domElement.querySelector('#SingleFeedbackersField')!.innerHTML = item.FeedbackReceived.toString();
      //TODO: set genres in a nice fashion
      this.domElement.querySelector('#SingleGenreField')!.innerHTML = item.Genres;
      //TODO: Set triggers in a nice fashion
      this.domElement.querySelector('#SingleTriggersField')!.innerHTML = item.Triggers;
      //TODO: set tags in a nice fashion
      this.domElement.querySelector('#SingleTagsField')!.innerHTML = item.Tags;
      this.domElement.querySelector('#SingleSubdivisionTitle')!.innerHTML = "Version";
      //TODO: pull versions from SP and set the content in subdivisionTable
      this._renderSingleAsync(item.Reference);

      this.domElement.querySelector('#latestVersionRedirectButton')!.innerHTML = "Go to latest version &rarr";
      //TODO: shift to writing feedback view

    }

  }

  private _renderCollectionAsync(CID: string) {
    this._getCollectionListdata(CID)
      .then((response) => {
        this._renderCollection(response.value);
      })
      .catch(() => { });
  }

  private _getCollectionListdata(CID: string): Promise<ICollectionList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Collections')/items?$filter= CollectionID eq '`+CID+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
    }
  private _renderCollection(items: ICollectionListItem[]): void {
    let item = items[0];
    this.domElement.querySelector('#CollectionTitleField')!.innerHTML = item.Title;
    this._renderSinglesAsync(item.CollectionID);
  }

  private _renderSinglesAsync(CID: string) {
    this._getSinglesListdata(CID)
      .then((response) => {
        this._renderSingles(response.value);
      })
      .catch(() => { });
  }

  private _getSinglesListdata(CID: string): Promise<ISingleList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Singles')/items?$filter= CollectionID eq '`+CID+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
    }
  private _renderSingles(items: ISingleListItem[]): void {
    let html = `
    <tr>
      <th>Chapter/component:</th>
      <th>Date:</th>
      <th>Link:</th>
    </tr>`;
    items.forEach((item: ISingleListItem)=>{
      //TODO: have the created date be a bit better looking
      html+=`
      <tr>
        <td>`+item.Title+`</td>
        <td>`+item.Created+`</td>
        <td> <button id="`+item.SingleID+`" onclick="
        
        
        ">To Chapter&rarr;</button></td>
      </tr>`;
    });
    this.domElement.querySelector('#CollectionSubdivisionTable')!.innerHTML = html;
    this._bindLatestSingle(items[items.length-1].SingleID);
  }

  private _bindLatestSingle(SID:string):void{
    //TODO: actually check whether it is the last addition
    this.domElement.querySelector('#latestSingleRedirectButton')?.addEventListener('click', ()=>{
      this._renderSingleAsync(SID)
    })
  }

  private _renderSingleAsync(SID: string) {
    this._getSingleListdata(SID)
      .then((response) => {
        this._renderSingle(response.value);
      })
      .catch(() => { });
  }

  private _getSingleListdata(SID: string): Promise<ISingleList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Singles')/items?$filter= SingleID eq '`+SID+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
    }
  private _renderSingle(items: ISingleListItem[]): void {
    let item = items[0];
    (<HTMLElement>this.domElement.querySelector('#CollectionOverview')).style.display = "none";
    (<HTMLElement>this.domElement.querySelector('#SingleOverview')).style.display = "block";
    //TODO: restructure the Writing, Collection and Single Datapoints
    //this.domElement.querySelector('#SingleOverviewDesc')!.innerHTML = item.Description;
    this.domElement.querySelector('#SingleTitleField')!.innerHTML = item.Title;

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
    //TODO: pull versions from SP and set the content in subdivisionTable
    this._renderVersionsAsync(item.SingleID);
    this.domElement.querySelector('#latestVersionRedirectButton')!.innerHTML = "Go to latest version &rarr";
  }

  private _renderVersionsAsync(SID: string) {
    this._getVersionsListdata(SID)
      .then((response) => {
        this._renderVersions(response.value);
      })
      .catch(() => { });
  }

  private _getVersionsListdata(SID: string): Promise<IVersionList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Versions')/items?$filter= SingleID eq '`+SID+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
    }
  private _renderVersions(items: IVersionListItem[]): void {
    let html = `
    <tr>
      <th>Version:</th>
      <th>Date:</th>
      <th>Link:</th>
    </tr>`;
    items.forEach((item: IVersionListItem)=>{
      //TODO: have the created date be a bit better looking
      html+=`
      <tr>
        <td>`+item.VersionName+`</td>
        <td>`+item.Created+`</td>
        <td> <button id="`+item.Title+`" onclick="
        window.location.href='explore single.html';
        
        
        ">To Version&rarr;</button></td>
      </tr>`;
    });
    this.domElement.querySelector('#SingleSubdivisionTable')!.innerHTML = html;
    this._bindLatestVersion(items[items.length-1].SingleID);
  }



  private _bindLatestVersion(SID:string):void{
    //TODO: actually check whether it is the last version
    this.domElement.querySelector('#latestVersionRedirectButton')?.addEventListener('click', ()=>{
      //TODO: shift to document


    })
  }

}
