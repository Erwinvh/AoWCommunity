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
import SharedHTMLRender from '../../shared/SharedHTMLRenderer';

import * as Objects from '../../shared/Objects';

import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

export interface ITbdContainerWebPartProps {
  description: string;
  title: string;
}


export default class TbdContainerWebPart extends BaseClientSideWebPart<ITbdContainerWebPartProps> {
  public render(): void {
    const htmlRenderer = new HTMLRenderer();
    const sharedHTMLRender = new SharedHTMLRender();
    this.domElement.innerHTML = `
    <div class="${styles.maincontainer}">`
      +htmlRenderer.RenderOwnedpiecesOverview()
      //TODO: add html Renderer for CollectionOverviewOwned
      //TODO: add html Renderer for SingleOverviewOwned
      +htmlRenderer.RenderNewWritingForm()
    +`</div>`
    +sharedHTMLRender.renderMemberBar("MyWritings");

    this.renderWritingsAsync();

    this.bindButtons();
    this.bindNewWritingCheckboxes();
    this.populateAddWritingCollectionSelectors();
    this.bindCollectionSelector();
    this.bindDropUploadBox();

    this.bindGTTSingleButtons("Single", "Triggers");
    this.bindGTTSingleButtons("Collection", "Triggers");
    this.bindGTTSingleButtons("Single", "Tags");
    this.bindGTTSingleButtons("Collection", "Tags");
    this.bindGTTSingleButtons("Single", "Genres");
    this.bindGTTSingleButtons("Collection", "Genres");

    this.populateGTTSingleBoxes("Single");
    this.populateGTTSingleBoxes("Collection");
  }

  private bindGTTSingleButtons(Type:string, GTT: string):void{
    const addButton = (<HTMLElement>this.domElement.querySelector('#add'+GTT+Type));
    const removeButton = (<HTMLElement>this.domElement.querySelector('#remove'+GTT+Type));
    const excludedElements = (<HTMLDivElement>this.domElement.querySelector('#excluded'+GTT+Type));
    const includedElements = (<HTMLDivElement>this.domElement.querySelector('#included'+GTT+Type));
    const GTTBoxSelectedID = (<HTMLElement>this.domElement.querySelector('#Selected'+Type+GTT+'GTTItemID'));
    const GTTBoxSelectedName = (<HTMLElement>this.domElement.querySelector('#Selected'+Type+GTT+'GTTItemName'));
    const GTTBoxSelectedParent = (<HTMLElement>this.domElement.querySelector('#Selected'+Type+GTT+'GTTItemParent'));
    addButton.addEventListener('click', ()=>{
      if(GTTBoxSelectedParent.innerHTML !== "included"+GTT+Type){
        let html = includedElements.innerHTML;
        const toreplace = `<div id="`+GTTBoxSelectedID.innerHTML+`" class="${styles.GTTItemSelected}">`+GTTBoxSelectedName.innerHTML+`</div>`
        const addition = `<div id="`+GTTBoxSelectedID.innerHTML+`" class="${styles.GTTItem}">`+GTTBoxSelectedName.innerHTML+`</div>`
        html+= addition;
        includedElements.innerHTML = html;
        GTTBoxSelectedID.innerHTML = "";
        GTTBoxSelectedName.innerHTML = "";
        GTTBoxSelectedParent.innerHTML = "";
        excludedElements.innerHTML = excludedElements.innerHTML.replace(toreplace , "");
        const includedmembers = [].slice.call(includedElements.getElementsByTagName('*'),0);
        const excludedmembers = [].slice.call(excludedElements.getElementsByTagName('*'),0);
        includedmembers.forEach((item: HTMLElement) => {
          this.bindGTTSingleBoxItem(item.id, "Selected"+Type+GTT+"GTTItem");
        })
        excludedmembers.forEach((item: HTMLElement) => {
          this.bindGTTSingleBoxItem(item.id, "Selected"+Type+GTT+"GTTItem");
        }) 
      }
    });
    removeButton.addEventListener('click', ()=>{
      if(GTTBoxSelectedParent.innerHTML !== "excluded"+GTT+Type){
        let html = excludedElements.innerHTML;
        const toreplace = `<div id="`+GTTBoxSelectedID.innerHTML+`" class="${styles.GTTItemSelected}">`+GTTBoxSelectedName.innerHTML+`</div>`
        const addition = `<div id="`+GTTBoxSelectedID.innerHTML+`" class="${styles.GTTItem}">`+GTTBoxSelectedName.innerHTML+`</div>`
        html+= addition;
        excludedElements.innerHTML = html;
        GTTBoxSelectedID.innerHTML = "";
        GTTBoxSelectedName.innerHTML = "";
        GTTBoxSelectedParent.innerHTML = "";
        includedElements.innerHTML = includedElements.innerHTML.replace(toreplace , "");
        const includedmembers = [].slice.call(includedElements.getElementsByTagName('*'),0);
        const excludedmembers = [].slice.call(excludedElements.getElementsByTagName('*'),0);
        includedmembers.forEach((item: HTMLElement) => {
          this.bindGTTSingleBoxItem(item.id, "Selected"+Type+GTT+"GTTItem");
        })
        excludedmembers.forEach((item: HTMLElement) => {
          this.bindGTTSingleBoxItem(item.id, "Selected"+Type+GTT+"GTTItem");
        })
      }
    });
  }

  private populateGTTSingleBoxes(Type:string):void{
    const excludedTriggersElement = (<HTMLElement>this.domElement.querySelector('#excludedTriggers'+Type));
    const excludedTagsElement = (<HTMLElement>this.domElement.querySelector('#excludedTags'+Type));
    const excludedGenresElement = (<HTMLElement>this.domElement.querySelector('#excludedGenres'+Type));
    this.getTriggersList().then((response)=>{
      let html:string = ``
      const items = response.value;
      items.forEach((item: Objects.ITriggerListItem) => {
        html+=`<div id="${item.Title}${Type}TriggersGTTItem" class="${styles.GTTItem}">${item.Trigger}</div>`
      })
      excludedTriggersElement.innerHTML = html;
      items.forEach((item: Objects.ITriggerListItem) => {
        this.bindGTTSingleBoxItem(item.Title+Type+"TriggersGTTItem", "Selected"+Type+"TriggersGTTItem");
      })
    }).catch((e) => { console.log(e) });
    this.getTagsList().then((response)=>{
      let html:string = ``
      const items = response.value;
      items.forEach((item: Objects.ITagListItem) => {
        html+=`<div id="${item.Title}${Type}TagsGTTItem" class="${styles.GTTItem}">${item.Tag}</div>`
      })
      excludedTagsElement.innerHTML = html;
      items.forEach((item: Objects.ITagListItem) => {
        this.bindGTTSingleBoxItem(item.Title+Type+"TagsGTTItem", "Selected"+Type+"TagsGTTItem");
      })
    }).catch((e) => { console.log(e) });
    this.getGenresList().then((response)=>{
      let html:string = ``
      const items = response.value;
      items.forEach((item: Objects.IGenreListItem) => {
        html+=`<div id="${item.Title}${Type}GenresGTTItem" class="${styles.GTTItem}">${item.Genre}</div>`
      })
      excludedGenresElement.innerHTML = html;
      items.forEach((item: Objects.IGenreListItem) => {
        this.bindGTTSingleBoxItem(item.Title+Type+"GenresGTTItem", "Selected"+Type+"GenresGTTItem");
      })
    }).catch((e) => { console.log(e) });
  }

  private bindGTTSingleBoxItem(ID: string, SelectedID:string):void{
    const GTTBoxItem = (<HTMLElement>this.domElement.querySelector('#'+ID));
    GTTBoxItem.addEventListener('click', ()=>{
      const GTTBoxSelectedID = (<HTMLElement>this.domElement.querySelector('#'+SelectedID+"ID"));
      const GTTBoxSelectedName = (<HTMLElement>this.domElement.querySelector('#'+SelectedID+"Name"));
      const GTTBoxSelectedParent = (<HTMLElement>this.domElement.querySelector('#'+SelectedID+"Parent"));
      GTTBoxSelectedName.innerHTML = GTTBoxItem.innerHTML;
      GTTBoxSelectedID.innerHTML = ID;
      if(GTTBoxItem.parentElement)
      GTTBoxSelectedParent.innerHTML = GTTBoxItem.parentElement.id
      const oldSelected = this.domElement.getElementsByClassName(`${styles.GTTItemSelected}`);
      var arrFromList = [].slice.call(oldSelected);
      arrFromList.forEach((element:HTMLElement)=>{
        element.className = `${styles.GTTItem}`
      })
      GTTBoxItem.className = `${styles.GTTItemSelected}`;

    });
  }

  private getTriggersList():Promise<Objects.ITriggerList>{
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Triggers')/items?`, SPHttpClient.configurations.v1)
          .then((response: SPHttpClientResponse) => {
            return response.json();
          })
          .catch(() => { return });
  }

  private getTagsList():Promise<Objects.ITagList>{
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Tags')/items?`, SPHttpClient.configurations.v1)
          .then((response: SPHttpClientResponse) => {
            return response.json();
          })
          .catch(() => { return });
  }
  private getGenresList():Promise<Objects.IGenreList>{
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Genres')/items?`, SPHttpClient.configurations.v1)
          .then((response: SPHttpClientResponse) => {
            return response.json();
          })
          .catch(() => { return });
  }

private bindDropUploadBox():void{
  const singleElement = (<HTMLInputElement>this.domElement.querySelector('#NewSingleDocument'));
  const versionElement = (<HTMLInputElement>this.domElement.querySelector('#NewVersionDocument'));
  singleElement.addEventListener('change', ()=>{

    const ImageElement = (<HTMLImageElement>this.domElement.querySelector('#NewSingleDocumentImage'))
    if(singleElement!==null && singleElement.files!== null && singleElement.files.length!==0){
      const file = singleElement.files[0];
      ImageElement.src = `${require('../../shared/assets/page.png')}`;
      (<HTMLElement>this.domElement.querySelector('#NewSingleDocumentInstruction')).innerHTML = "";
      (<HTMLElement>this.domElement.querySelector('#NewSingleDocumentTag')).innerHTML = ""+ file.name;
    }else{
      ImageElement.src = `${require('../../shared/assets/upload.png')}`;
      (<HTMLElement>this.domElement.querySelector('#NewSingleDocumentInstruction')).innerHTML = "Upload any .pdf files from desktop";
      (<HTMLElement>this.domElement.querySelector('#NewSingleDocumentTag')).innerHTML = "click here to upload your .pdf file";
    }
  });

  versionElement.addEventListener('change', ()=>{

    const ImageElement = (<HTMLImageElement>this.domElement.querySelector('#NewVersionDocumentImage'))
    if(singleElement!==null && singleElement.files!== null && singleElement.files.length!==0){
      const file = singleElement.files[0];
      ImageElement.src = `${require('../../shared/assets/page.png')}`;
      (<HTMLElement>this.domElement.querySelector('#NewVersionDocumentInstruction')).innerHTML = "";
      (<HTMLElement>this.domElement.querySelector('#NewVersionDocumentTag')).innerHTML = ""+ file.name;
    }else{
      ImageElement.src = `${require('../../shared/assets/upload.png')}`;
      (<HTMLElement>this.domElement.querySelector('#NewVersionDocumentInstruction')).innerHTML = "Upload any .pdf files from desktop";
      (<HTMLElement>this.domElement.querySelector('#NewVersionDocumentTag')).innerHTML = "click here to upload your .pdf file";
    }
  });
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

  private bindCollectionSelector():void{
    this.domElement.querySelector('#availableVersionCollections')?.addEventListener('click', ()=>{
      const value = (<HTMLSelectElement>this.domElement.querySelector('#availableVersionCollections')).value;
      if(value!=="NoCollection"){
        this.getSinglesFromCollectionID(value).then((response)=>{
          let html:string = ``;
          response.value.forEach((item: Objects.ISingleListItem) => {
            html+= `<option value="`+item.Title+`">`+item.SingleTitle+`</option>`
          })
          this.domElement.querySelector('#availableVersionSingles')!.innerHTML = html;
        }).catch((e)=>{console.log(e)})
      }else{
        const html:string = `<option value="NoSingle">-----</option>`;
        this.domElement.querySelector('#availableVersionSingles')!.innerHTML = html;
      }
    });
  }

  private getSinglesFromCollectionID(CID:string): Promise<Objects.ISingleList>{
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Singles')/items?$filter= CollectionID eq '`+CID+`'`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });

  }

  private renderWritingsAsync():void{
    const UserID = this.context.pageContext.user.displayName;
    this._getWritingsListdata(UserID)
    .then((response) => {
      this._renderWritingsList(response.value);
    })
    .catch((e)=>{console.log(e)})
  }

  private _getWritingsListdata(UserID:string): Promise<Objects.IWritingList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Writings')/items?$filter= Owner eq '`+UserID+`'& $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
    }

    private _renderWritingsList(items: Objects.IWritingListItem[]): void {
      let fictionHtml: string = '';
      let nonFictionHtml: string = '';
      let scriptsHtml: string = '';
      let poetryHtml: string = '';
      let otherHtml: string = '';

      items.forEach((item: Objects.IWritingListItem)=>{
        let html:string = ``;
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
        switch(item.Writingtype){
          case "Fiction":
            fictionHtml+=html;
            break;
        case "Nonfiction":
            nonFictionHtml+=html;
            break;
        case "Poetry":
            poetryHtml+=html;
            break;
        case "Scripts":
            scriptsHtml+=html;
            break;
        case "Other":
        default:
            otherHtml+=html;
            break;
        }
      })

      this.domElement.querySelector('#FictionExploreContainer')!.innerHTML = fictionHtml;
      this.domElement.querySelector('#NonfictionExploreContainer')!.innerHTML = nonFictionHtml;
      this.domElement.querySelector('#ScriptsExploreContainer')!.innerHTML = scriptsHtml;
      this.domElement.querySelector('#PoetryExploreContainer')!.innerHTML = poetryHtml;
      this.domElement.querySelector('#OtherExploreContainer')!.innerHTML = otherHtml;
    }

    private bindButtons():void{
      this.bindBackButtons();
      this.bindNewWritingButton();
      this.bindAddNewWritingButton();
    }

private bindBackButtons():void{
  this.domElement.querySelector('#NewWritingBackButton')?.addEventListener('click', ()=>{
    (<HTMLElement>this.domElement.querySelector('#NewWritingForm')).style.display = "none";
    (<HTMLElement>this.domElement.querySelector('#OwnedOverview')).style.display = "block";
    this.emptyAddWritingFields();
  })
}
  private bindNewWritingButton():void{
    this.domElement.querySelector('#NewWritingButton')?.addEventListener('click', ()=>{
      (<HTMLElement>this.domElement.querySelector('#NewWritingForm')).style.display = "block";
      (<HTMLElement>this.domElement.querySelector('#OwnedOverview')).style.display = "none";
    })
  }

  private bindAddNewWritingButton():void{
    this.domElement.querySelector('#PostNewWritingButton')?.addEventListener('click', ()=>{
      const VersionCollection = (<HTMLSelectElement>this.domElement.querySelector('#availableVersionCollections')).value;
      const VersionSingle = (<HTMLSelectElement>this.domElement.querySelector('#availableVersionSingles')).value;
      const NewVersionName = (<HTMLInputElement>this.domElement.querySelector('#NewVersionName')).value;
      const NewVersionDocument = (<HTMLInputElement>this.domElement.querySelector('#NewVersionDocument')).files;
      const NewSingleName = (<HTMLInputElement>this.domElement.querySelector('#NewSingleName')).value;
      const NewSingleVersionName = (<HTMLInputElement>this.domElement.querySelector('#NewSingleVersionName')).value;
      const NewSingleDescription = (<HTMLTextAreaElement>this.domElement.querySelector('#NewSingleDescription')).value;
      const Visibility = (<HTMLSelectElement>this.domElement.querySelector('#Visibility')).value;
      const SingleType = (<HTMLSelectElement>this.domElement.querySelector('#SingleType')).value;
      const SingleState = (<HTMLSelectElement>this.domElement.querySelector('#SingleState')).value;
      const NewSingleDocument = (<HTMLInputElement>this.domElement.querySelector('#NewSingleDocument')).files;
      const chosenCollection = (<HTMLSelectElement>this.domElement.querySelector('#availableCollections')).value;
      const NewCollectionName = (<HTMLInputElement>this.domElement.querySelector('#NewCollectionName')).value;
      const CollectionType = (<HTMLSelectElement>this.domElement.querySelector('#CollectionType')).value;
      const NewCollectionDescription = (<HTMLTextAreaElement>this.domElement.querySelector('#NewCollectionDescription')).value;
      const NewVersionCheck = (<HTMLInputElement>this.domElement.querySelector('#IsNewVersionCheckBox')).checked;
      const PartCollectionCheck = (<HTMLInputElement>this.domElement.querySelector('#IsPartOfCollectionCheckBox')).checked; 
      const includedSingleTriggers = [].slice.call((<HTMLDivElement>this.domElement.querySelector('#includedTriggersSingle')).getElementsByTagName('*'),0);
      const includedCollectionTriggers = [].slice.call((<HTMLDivElement>this.domElement.querySelector('#includedTriggersCollection')).getElementsByTagName('*'),0);
      const includedSingleTags = [].slice.call((<HTMLDivElement>this.domElement.querySelector('#includedTagsSingle')).getElementsByTagName('*'),0);
      const includedCollectionTags = [].slice.call((<HTMLDivElement>this.domElement.querySelector('#includedTagsCollection')).getElementsByTagName('*'),0);
      const includedSingleGenres = [].slice.call((<HTMLDivElement>this.domElement.querySelector('#includedGenresSingle')).getElementsByTagName('*'),0);
      const includedCollectionGenres = [].slice.call((<HTMLDivElement>this.domElement.querySelector('#includedGenresCollection')).getElementsByTagName('*'),0);

      if(NewVersionCheck === true){
        if(NewVersionName!=="" && NewVersionDocument?.length !== 0 && NewVersionDocument !== null && VersionSingle !== "NoSingle" && VersionCollection !== "NoCollection"){
            this.postNewVersion(NewVersionName, VersionSingle, NewVersionDocument[0]);
            (<HTMLElement>this.domElement.querySelector('#NewWritingForm')).style.display = "none";
            (<HTMLElement>this.domElement.querySelector('#OwnedOverview')).style.display = "block";
            this.emptyAddWritingFields();
        }else{
        alert("Not all required fields for a new version have been filled in.")
        return;
        }
      }else{
        if(NewSingleVersionName !== "" && NewSingleName !== "" && NewSingleDescription!=="" && NewSingleDocument?.length !== 0 && NewSingleDocument !== null && NewSingleDocument[0] !== null){
          //This portion is for saving to a collection
          if(PartCollectionCheck === true){
            if(chosenCollection === "NewCollection"){ 
              //This portion is about posting a new collection and single
              if(NewCollectionName !== "" && NewCollectionDescription!==""){
                this.getNextListItemID("Collections", "CID").then((responseCollectionID)=>{
                  this.postNewCollection(NewCollectionName, NewCollectionDescription, responseCollectionID);
                  this.postNewWriting(NewCollectionName, NewCollectionDescription, "Collection", CollectionType, "", Visibility, responseCollectionID, includedCollectionTriggers, includedCollectionTags, includedCollectionGenres);
                  this.getNextListItemID("Singles", "SID").then((responseSingleID)=>{
                    this.postNewSingle(NewSingleName, NewSingleDescription, responseCollectionID, responseSingleID);
                    this.postNewWriting(NewSingleName, NewSingleDescription, "Single", SingleType, SingleState, Visibility, responseSingleID, includedSingleTriggers, includedSingleTags, includedSingleGenres);
                    this.postNewVersion(NewVersionName, responseSingleID, NewSingleDocument[0]);
                    (<HTMLElement>this.domElement.querySelector('#NewWritingForm')).style.display = "none";
                    (<HTMLElement>this.domElement.querySelector('#OwnedOverview')).style.display = "block";
                    this.emptyAddWritingFields();
                }).catch((e)=>{console.log(e)});
              }).catch((e)=>{console.log(e)});
              }else{
                alert("Not all required fields for a new piece collection have been filled in.")
                return;
              }
            }else{
              //This portion is about posting a single to an existing collection
              if(chosenCollection!=="NoCollection"){
                this.getNextListItemID("Singles", "SID").then((responseSingleID)=>{
                  this.postNewSingle(NewSingleName, NewSingleDescription, chosenCollection, responseSingleID);
                  this.postNewWriting(NewSingleName, NewSingleDescription, "Single", SingleType, SingleState, Visibility, responseSingleID, includedSingleTriggers, includedSingleTags, includedSingleGenres);
                    this.postNewVersion(NewSingleVersionName, responseSingleID, NewSingleDocument[0]);
                    (<HTMLElement>this.domElement.querySelector('#NewWritingForm')).style.display = "none";
                    (<HTMLElement>this.domElement.querySelector('#OwnedOverview')).style.display = "block";
                    this.emptyAddWritingFields();
                }).catch((e)=>{console.log(e)});
                //TODO: update the collection writing with a new last updated
              }else{
                alert("No collection has been assigned to this piece of writing")
                return;
              }
            }
          }else{
            //This portion is for saving to only a new single
            this.getNextListItemID("Singles", "SID").then((responseSingleID)=>{
              this.postNewSingle(NewSingleName, NewSingleDescription, "", responseSingleID);
              this.postNewWriting(NewSingleName, NewSingleDescription, "Single", SingleType, SingleState, Visibility, responseSingleID, includedSingleTriggers, includedSingleTags, includedSingleGenres);
                this.postNewVersion(NewSingleVersionName, responseSingleID, NewSingleDocument[0]);
                (<HTMLElement>this.domElement.querySelector('#NewWritingForm')).style.display = "none";
                (<HTMLElement>this.domElement.querySelector('#OwnedOverview')).style.display = "block";
                this.emptyAddWritingFields();
            }).catch((e)=>{console.log(e)})
            }
        }else{
          alert("Not all required fields for a new piece of writing have been filled in.")
          return;
      }
      }
      

    })
  }

private postNewCollection(NewCollectionName: string, NewCollectionDescription:string, CollectionID:string):void{
  const CollectionSiteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Collections')/Items"
  const UserID = this.context.pageContext.user.displayName;
  const NewCollection: any = {
    "Title": CollectionID,
    "CollectionTitle": NewCollectionName,
    "OwnerID": UserID, 
    "Description": NewCollectionDescription
  }
  const spHttpClientOptions: ISPHttpClientOptions = {
    "body": JSON.stringify(NewCollection)
  }
  this.context.spHttpClient.post((CollectionSiteUrl), SPHttpClient.configurations.v1, spHttpClientOptions)
  .then((response: SPHttpClientResponse)=>{
  }).catch((e)=>{console.log(e)});
}

private postNewVersion(NewVersionName: string, VersionSingle: string, Document: File):void{
  this.getNextListItemID("Versions", "VID").then((responseVersionID)=>{
    const VersionSiteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Versions')/Items"
    const NewVersion: any = {
      "Title": responseVersionID,
      "SingleID": VersionSingle,
      "VersionName": NewVersionName
    }
    const spHttpClientOptions: ISPHttpClientOptions = {
      "body": JSON.stringify(NewVersion)
    }
    this.context.spHttpClient.post((VersionSiteUrl), SPHttpClient.configurations.v1, spHttpClientOptions)
    .then((response: SPHttpClientResponse)=>{
      this.postNewDocument(Document, responseVersionID);
    }).catch((e)=>{console.log(e)});
  }).catch((e)=>{console.log(e)});
}

private postNewSingle(NewSingleName: string, NewSingleDescription: string, chosenCollection: string, SingleID:string):void{
  const SingleSiteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Singles')/Items"
  const UserID = this.context.pageContext.user.displayName;
  const NewSingle: any = {
    "Title": SingleID,
    "SingleTitle": NewSingleName,
    "CollectionID": chosenCollection,
    "AuthorID": UserID,
    "Description": NewSingleDescription
  }
  const spHttpClientOptions: ISPHttpClientOptions = {
    "body": JSON.stringify(NewSingle)
  }
  this.context.spHttpClient.post((SingleSiteUrl), SPHttpClient.configurations.v1, spHttpClientOptions)
  .then((response: SPHttpClientResponse)=>{
  }).catch((e)=>{console.log(e)});
}

private postNewWriting(NewName: string, NewDescription: string, WorkType: string, WritingType: string, State: string, Visibility: string, Reference:string, Triggers: any, Tags: any, Genres: any):void{
  this.getNextListItemID("Writings", "WID").then((response)=>{
    const WritingSiteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Writings')/Items"
    const UserID = this.context.pageContext.user.displayName;
    let triggers = ""
    Triggers.forEach((Trigger:HTMLElement)=>{
      triggers+= Trigger.innerHTML+", ";
    })
    let tags = ""
    Tags.forEach((Tag:HTMLElement)=>{
      tags+= Tag.innerHTML+", ";
    })
    let genres = ""
    Genres.forEach((Genre:HTMLElement)=>{
      genres+= Genre.innerHTML+", ";
    })
    const NewWriting: any = {
      "Title": response,
      "Visibility": Visibility,
      "Writingtype": WritingType,
      "WorkType": WorkType,
      "Owner": UserID,
      "Writingstate": State, 
      "Writingtitle": NewName, 
      "Description": NewDescription,
      "Reference": Reference,
      "Views": 0,
      "FeedbackReceived": 0,
      "Triggers": triggers,
      "Genres": genres,
      "Tags": tags
    }
    const spHttpClientOptions: ISPHttpClientOptions = {
      "body": JSON.stringify(NewWriting)
    }
    this.context.spHttpClient.post((WritingSiteUrl), SPHttpClient.configurations.v1, spHttpClientOptions)
    .then((response: SPHttpClientResponse)=>{
      this.ReloadOwnedWriting();
    }).catch((e)=>{console.log(e)});
  }).catch((e)=>{console.log(e)})
  
}

private ReloadOwnedWriting():void{
  this.renderWritingsAsync();
}

private getLitsItemID(ItemID:string, ListName:string):Promise<Objects.IIDList>{
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('`+ListName+`')/items?$filter= Title eq '`+ItemID+`'&$select=ID`, SPHttpClient.configurations.v1)
  .then((response: SPHttpClientResponse) => {
    return response.json();
  })
  .catch(() => { return });
}

private postNewDocument(file: any, VersionID:string):void{
this.getLitsItemID(VersionID, "Versions").then((response)=>{
  const Options: ISPHttpClientOptions = {
    headers:{
      "Accept": "application/json",
      "Content-type": "application.json"
    },
    body: file
  };
  const url: string = this.context.pageContext.site.absoluteUrl + `/_api/web/lists/getbytitle('Versions')/items(`+response.value[0].ID+`)/AttachmentFiles/add(Filename='${file.name}')`
  this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, Options).then((response: SPHttpClientResponse)=>{
  }).catch((e)=>{console.log(e)})
}).catch((e)=>{console.log(e)});
}

  private emptyAddWritingFields():void{
    (<HTMLSelectElement>this.domElement.querySelector('#availableVersionCollections')).selectedIndex = 0;
    (<HTMLSelectElement>this.domElement.querySelector('#availableVersionSingles')).selectedIndex = 0;
    (<HTMLInputElement>this.domElement.querySelector('#NewVersionName')).value = "";
    (<HTMLInputElement>this.domElement.querySelector('#NewVersionDocument')).value = "";
    (<HTMLInputElement>this.domElement.querySelector('#NewSingleName')).value = "";
    (<HTMLInputElement>this.domElement.querySelector('#NewSingleVersionName')).value = "";
    (<HTMLTextAreaElement>this.domElement.querySelector('#NewSingleDescription')).value = "";
    (<HTMLSelectElement>this.domElement.querySelector('#Visibility')).selectedIndex = 0;
    (<HTMLSelectElement>this.domElement.querySelector('#SingleType')).selectedIndex = 0;
    (<HTMLSelectElement>this.domElement.querySelector('#SingleState')).selectedIndex = 0;
    (<HTMLInputElement>this.domElement.querySelector('#NewSingleDocument')).value = "";
    (<HTMLSelectElement>this.domElement.querySelector('#availableCollections')).selectedIndex = 0;
    (<HTMLInputElement>this.domElement.querySelector('#NewCollectionName')).value = "";
    (<HTMLSelectElement>this.domElement.querySelector('#CollectionType')).selectedIndex = 0;
    (<HTMLTextAreaElement>this.domElement.querySelector('#NewCollectionDescription')).value = "";

  }

private bindNewWritingCheckboxes():void{
  this.domElement.querySelector('#IsNewVersionCheckBox')?.addEventListener('click', ()=>{
    const element = <HTMLInputElement>this.domElement.querySelector('#IsNewVersionCheckBox');
    if(element && element.checked){
      (<HTMLElement>this.domElement.querySelector('#NewVersionFields')).style.display = "block";
      (<HTMLInputElement>this.domElement.querySelector('#IsPartOfCollectionCheckBox')).checked = false;
      (<HTMLElement>this.domElement.querySelector('#NewSingleFields')).style.display = "none";
    }else if(element && !element.checked){
      (<HTMLElement>this.domElement.querySelector('#NewVersionFields')).style.display = "none";
      (<HTMLElement>this.domElement.querySelector('#NewSingleFields')).style.display = "block";
    }
  })

  this.domElement.querySelector('#IsPartOfCollectionCheckBox')?.addEventListener('click', ()=>{
    const element = <HTMLInputElement>this.domElement.querySelector('#IsPartOfCollectionCheckBox');
    if(element && element.checked){
      (<HTMLElement>this.domElement.querySelector('#PartOfCollectionFields')).style.display = "block";
    }else if(element && !element.checked){
      (<HTMLElement>this.domElement.querySelector('#PartOfCollectionFields')).style.display = "none";
    }  })
}

private populateAddWritingCollectionSelectors():void{
  this._renderCollectionAsync(this.context.pageContext.user.displayName);
}

private _renderCollectionAsync(UserID: string):void {
  this._getCollectionListdata(UserID)
    .then((response) => {
      this._renderCollection(response.value);
    })
    .catch((e)=>{console.log(e)})
}

private _getCollectionListdata(UserID: string): Promise<Objects.ICollectionList> {
  return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Collections')/items?$filter= OwnerID eq '`+UserID+`' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .catch(() => { return });
  }

private _renderCollection(items: Objects.ICollectionListItem[]): void {
  let html:string = `<option value="NoCollection">None</option>`;
  const add: string = `<option value="NewCollection">Make a new Collection</option>`;
  items.forEach((item: Objects.ICollectionListItem)=>{
    html+=`<option value="`+item.Title+`">`+item.CollectionTitle+`</option>`
  });
  this.domElement.querySelector('#availableVersionCollections')!.innerHTML = html;
  this.domElement.querySelector('#availableCollections')!.innerHTML = html+add;
  this.bindNewCollectionSelector();

}

private bindNewCollectionSelector():void{
  this.domElement.querySelector('#availableCollections')?.addEventListener('click', ()=>{
    const element = <HTMLSelectElement>this.domElement.querySelector('#availableCollections');
    if(element && element.value==="NewCollection"){
      (<HTMLElement>this.domElement.querySelector('#NewCollectionFields')).style.display = "block";
    }else{
      (<HTMLElement>this.domElement.querySelector('#NewCollectionFields')).style.display = "none";
    }
  });
}

private getNextListItemID(ListName: string, IDPrefix:string): Promise<string>{
  return this._getIDListdata(ListName).then((response)=>{
    let ID:string = IDPrefix+"-1";
    if(response.value.length!==0){
      const NewestID = response.value[0].Title;
      const replacement = IDPrefix +"-"
      const substring = NewestID.replace(replacement, "");
      let IDnumber = parseInt(substring);
      IDnumber++;
      ID = IDPrefix+"-"+IDnumber;
      return ID;
    }else{
      return ID;
    }
  })
  }
  
  private _getIDListdata(ListName:string): Promise<Objects.IIDList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('`+ListName+`')/items?$select=ID, Title&$orderby=ID desc&$top= 1`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
    }

}
