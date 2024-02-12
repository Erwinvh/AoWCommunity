//Imports: 
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';

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

//Exports:
export interface ITbdContainerWebPartProps {
  description: string;
  title: string;
}

export default class TbdContainerWebPart extends BaseClientSideWebPart<ITbdContainerWebPartProps> {
  
  //Base SPFX method, no need to touch it
  protected onInit(): Promise<void> {
    return super.onInit();
  }

  //Base SPFX method, no need to touch it
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

  //Base SPFX method, no need to touch it
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  //Base SPFX method, no need to touch it
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
  
  //Render method to construct the my writing webpart, this method is automatically called when the webpart is inserted into a web-page. 
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method is called on a new webpart for the my writing page.
  public render(): void {
    const htmlRenderer = new HTMLRenderer();
    const sharedHTMLRender = new SharedHTMLRender();
    this.domElement.innerHTML = `
    <div class="${styles.maincontainer}">`
      + htmlRenderer.RenderOwnedpiecesOverview()
      //TODO: add html Renderer for CollectionOverviewOwned
      //TODO: add html Renderer for SingleOverviewOwned
      + htmlRenderer.RenderNewWritingForm()
      + `</div>`
      + sharedHTMLRender.renderMemberBar("MyWritings");

    this.renderWritingsAsync();

    this.bindButtons();
    this.bindNewWritingCheckboxes();
    this.populateAddWritingCollectionSelectors();
    this.bindCollectionSelector();
    this.bindDropUploadBox();
    this.bindAllGTTinputs();
    this.bindAllAddFeedbackComponents();
  }

  //Button binding method to bind the buttons and input fields for the Genre, Trigger and tags insert fields.
  //This method redirects to the binding and populating methods for the buttons and fields
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should only be called once after the base render of the new writing area has been called.
  private bindAllGTTinputs():void{
    this.bindGTTSingleButtons("Single", "Triggers");
    this.bindGTTSingleButtons("Collection", "Triggers");
    this.bindGTTSingleButtons("Single", "Tags");
    this.bindGTTSingleButtons("Collection", "Tags");
    this.bindGTTSingleButtons("Single", "Genres");
    this.bindGTTSingleButtons("Collection", "Genres");

    this.populateGTTSingleBoxes("Single");
    this.populateGTTSingleBoxes("Collection");
  }

  //Binding method to bind the buttons and input fields for feedback insertion.
  //This method binds the correct methods  to the binding and populating methods for the buttons and fields
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should only be called once after the base render of the new writing area has been called.
  private bindAllAddFeedbackComponents(): void {
    const AllFeedback = (<HTMLInputElement>this.domElement.querySelector('#AllFeedback'));
    const Questions = (<HTMLInputElement>this.domElement.querySelector('#QAFeedback'));
    const addButton = (<HTMLElement>this.domElement.querySelector('#addNewQuestionButton'));
    const removeButton = (<HTMLElement>this.domElement.querySelector('#removeQuestionButton'));
    const QuestionsCollection = (<HTMLElement>this.domElement.querySelector('#includedQuestions'));
    const BoxSelectedName = (<HTMLElement>this.domElement.querySelector('#SelectedQuestion'));
    AllFeedback.addEventListener('click', () => {
      if (AllFeedback.checked) {
        (<HTMLElement>this.domElement.querySelector('#FeedbackFieldsArea')).style.display = 'block'
      } else {
        (<HTMLElement>this.domElement.querySelector('#FeedbackFieldsArea')).style.display = 'none'
      }
    });
    Questions.addEventListener('click', () => {
      if (Questions.checked) {
        (<HTMLElement>this.domElement.querySelector('#NewQuestionFieldArea')).style.display = 'block'
      } else {
        (<HTMLElement>this.domElement.querySelector('#NewQuestionFieldArea')).style.display = 'none'
      }
    });
    addButton.addEventListener('click', () => {
      const textfield = (<HTMLInputElement>this.domElement.querySelector('#NewQuestionField'));
      if (textfield.value !== "") {
        QuestionsCollection.innerHTML = QuestionsCollection.innerHTML + `<div class="${styles.GTTItem}">${textfield.value}</div>`
        textfield.value = "";
      }
      const includedquestions = [].slice.call(QuestionsCollection.getElementsByTagName('*'), 0);
      includedquestions.forEach((item: HTMLElement) => {
        item.addEventListener('click', () => {
          BoxSelectedName.innerHTML = item.innerHTML;
          const oldSelected = this.domElement.getElementsByClassName(`${styles.GTTItemSelected}`);
          var arrFromList = [].slice.call(oldSelected);
          arrFromList.forEach((element: HTMLElement) => {
            element.className = `${styles.GTTItem}`
          })
          item.className = `${styles.GTTItemSelected}`;
        });
      })
    });
    removeButton.addEventListener('click', () => {
      if (BoxSelectedName.innerHTML !== "") {
        const oldSelected = this.domElement.getElementsByClassName(`${styles.GTTItemSelected}`);
        var arrFromList = [].slice.call(oldSelected);
        arrFromList.forEach((element: HTMLElement) => {
          QuestionsCollection.removeChild(element);
        })
      }
    });
  }

  //Button binding method to dynamically bind the Genre, Triggers and tags buttons based on the input.
  //This method sets the correct values for the buttons based off of whether the button is for a collection or 
  //single and whether it is set for Genre, Trigger or tag.
  // - Parameter: GTT, string: This parameter determines whether the button is related to a genre, trigger or tag
  // - Parameter: Type, string: This parameter determines whether the button is related to a collection or a single
  // - Returns:   Void
  // - Example:   This method can be called for multiple with different values. 
  //              This method should always be called after the initial render of the buttons.
  private bindGTTSingleButtons(Type: string, GTT: string): void {
    const addButton = (<HTMLElement>this.domElement.querySelector('#add' + GTT + Type));
    const removeButton = (<HTMLElement>this.domElement.querySelector('#remove' + GTT + Type));
    const excludedElements = (<HTMLDivElement>this.domElement.querySelector('#excluded' + GTT + Type));
    const includedElements = (<HTMLDivElement>this.domElement.querySelector('#included' + GTT + Type));
    const GTTBoxSelectedID = (<HTMLElement>this.domElement.querySelector('#Selected' + Type + GTT + 'GTTItemID'));
    const GTTBoxSelectedName = (<HTMLElement>this.domElement.querySelector('#Selected' + Type + GTT + 'GTTItemName'));
    const GTTBoxSelectedParent = (<HTMLElement>this.domElement.querySelector('#Selected' + Type + GTT + 'GTTItemParent'));
    addButton.addEventListener('click', () => {
      if (GTTBoxSelectedParent.innerHTML !== "included" + GTT + Type) {
        let html = includedElements.innerHTML;
        const toreplace = `<div id="` + GTTBoxSelectedID.innerHTML + `" class="${styles.GTTItemSelected}">` + GTTBoxSelectedName.innerHTML + `</div>`
        const addition = `<div id="` + GTTBoxSelectedID.innerHTML + `" class="${styles.GTTItem}">` + GTTBoxSelectedName.innerHTML + `</div>`
        html += addition;
        includedElements.innerHTML = html;
        GTTBoxSelectedID.innerHTML = "";
        GTTBoxSelectedName.innerHTML = "";
        GTTBoxSelectedParent.innerHTML = "";
        excludedElements.innerHTML = excludedElements.innerHTML.replace(toreplace, "");
        const includedmembers = [].slice.call(includedElements.getElementsByTagName('*'), 0);
        const excludedmembers = [].slice.call(excludedElements.getElementsByTagName('*'), 0);
        includedmembers.forEach((item: HTMLElement) => {
          this.bindGTTSingleBoxItem(item.id, "Selected" + Type + GTT + "GTTItem");
        })
        excludedmembers.forEach((item: HTMLElement) => {
          this.bindGTTSingleBoxItem(item.id, "Selected" + Type + GTT + "GTTItem");
        })
      }
    });
    removeButton.addEventListener('click', () => {
      if (GTTBoxSelectedParent.innerHTML !== "excluded" + GTT + Type) {
        let html = excludedElements.innerHTML;
        const toreplace = `<div id="` + GTTBoxSelectedID.innerHTML + `" class="${styles.GTTItemSelected}">` + GTTBoxSelectedName.innerHTML + `</div>`
        const addition = `<div id="` + GTTBoxSelectedID.innerHTML + `" class="${styles.GTTItem}">` + GTTBoxSelectedName.innerHTML + `</div>`
        html += addition;
        excludedElements.innerHTML = html;
        GTTBoxSelectedID.innerHTML = "";
        GTTBoxSelectedName.innerHTML = "";
        GTTBoxSelectedParent.innerHTML = "";
        includedElements.innerHTML = includedElements.innerHTML.replace(toreplace, "");
        const includedmembers = [].slice.call(includedElements.getElementsByTagName('*'), 0);
        const excludedmembers = [].slice.call(excludedElements.getElementsByTagName('*'), 0);
        includedmembers.forEach((item: HTMLElement) => {
          this.bindGTTSingleBoxItem(item.id, "Selected" + Type + GTT + "GTTItem");
        })
        excludedmembers.forEach((item: HTMLElement) => {
          this.bindGTTSingleBoxItem(item.id, "Selected" + Type + GTT + "GTTItem");
        })
      }
    });
  }

  //Preset method for the Genre, Tirgger and Tag fields. This method will fill in the input boxes with the available values for the given type.
  // - Parameter: Type: string, this value determines which of the GTT is being preset, these values can be: "Collection" and "Single"
  // - Returns:   Void
  // - Example:   This method should only be called once for every Type for each "new writing" view.
  private populateGTTSingleBoxes(Type: string): void {
    const excludedTriggersElement = (<HTMLElement>this.domElement.querySelector('#excludedTriggers' + Type));
    const excludedTagsElement = (<HTMLElement>this.domElement.querySelector('#excludedTags' + Type));
    const excludedGenresElement = (<HTMLElement>this.domElement.querySelector('#excludedGenres' + Type));
    this.getTriggersList().then((response) => {
      let html: string = ``
      const items = response.value;
      items.forEach((item: Objects.ITriggerListItem) => {
        html += `<div id="${item.Title}${Type}TriggersGTTItem" class="${styles.GTTItem}">${item.Trigger}</div>`
      })
      excludedTriggersElement.innerHTML = html;
      items.forEach((item: Objects.ITriggerListItem) => {
        this.bindGTTSingleBoxItem(item.Title + Type + "TriggersGTTItem", "Selected" + Type + "TriggersGTTItem");
      })
    }).catch((e) => { console.log(e) });
    this.getTagsList().then((response) => {
      let html: string = ``
      const items = response.value;
      items.forEach((item: Objects.ITagListItem) => {
        html += `<div id="${item.Title}${Type}TagsGTTItem" class="${styles.GTTItem}">${item.Tag}</div>`
      })
      excludedTagsElement.innerHTML = html;
      items.forEach((item: Objects.ITagListItem) => {
        this.bindGTTSingleBoxItem(item.Title + Type + "TagsGTTItem", "Selected" + Type + "TagsGTTItem");
      })
    }).catch((e) => { console.log(e) });
    this.getGenresList().then((response) => {
      let html: string = ``
      const items = response.value;
      items.forEach((item: Objects.IGenreListItem) => {
        html += `<div id="${item.Title}${Type}GenresGTTItem" class="${styles.GTTItem}">${item.Genre}</div>`
      })
      excludedGenresElement.innerHTML = html;
      items.forEach((item: Objects.IGenreListItem) => {
        this.bindGTTSingleBoxItem(item.Title + Type + "GenresGTTItem", "Selected" + Type + "GenresGTTItem");
      })
    }).catch((e) => { console.log(e) });
  }

  //Binding method to dynamically bind the items for Genre, Triggers and tags to select them or deselect them.
  //The selected items will be copied to the correspondingt given selected div.
  // - Parameter: ID, string: This parameter determines which GTT item box that has been selected
  // - Parameter: SelectedID, string: This parameter points to the hidden selection box that is related to the GTT selection.
  // - Returns:   Void
  // - Example:   This method should be called for every value in the single items for GTT. 
  private bindGTTSingleBoxItem(ID: string, SelectedID: string): void {
    const GTTBoxItem = (<HTMLElement>this.domElement.querySelector('#' + ID));
    GTTBoxItem.addEventListener('click', () => {
      const GTTBoxSelectedID = (<HTMLElement>this.domElement.querySelector('#' + SelectedID + "ID"));
      const GTTBoxSelectedName = (<HTMLElement>this.domElement.querySelector('#' + SelectedID + "Name"));
      const GTTBoxSelectedParent = (<HTMLElement>this.domElement.querySelector('#' + SelectedID + "Parent"));
      GTTBoxSelectedName.innerHTML = GTTBoxItem.innerHTML;
      GTTBoxSelectedID.innerHTML = ID;
      if (GTTBoxItem.parentElement)
        GTTBoxSelectedParent.innerHTML = GTTBoxItem.parentElement.id
      const oldSelected = this.domElement.getElementsByClassName(`${styles.GTTItemSelected}`);
      var arrFromList = [].slice.call(oldSelected);
      arrFromList.forEach((element: HTMLElement) => {
        element.className = `${styles.GTTItem}`
      })
      GTTBoxItem.className = `${styles.GTTItemSelected}`;

    });
  }

  //Get triggers method allows a full list of available trigger warnings to be pulled from the sharepoint.
  // - Parameter: None
  // - Returns:   Promise of a list of triggers
  // - Example:   return getTriggersList().then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private getTriggersList(): Promise<Objects.ITriggerList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Triggers')/items?`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Get tags method allows a full list of available tags warnings to be pulled from the sharepoint.
  // - Parameter: None
  // - Returns:   Promise of a list of tags
  // - Example:   return getTagsList().then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private getTagsList(): Promise<Objects.ITagList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Tags')/items?`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Get genres method allows a full list of available genres warnings to be pulled from the sharepoint.
  // - Parameter: None
  // - Returns:   Promise of a list of genres
  // - Example:   return getGenresList().then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private getGenresList(): Promise<Objects.IGenreList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Genres')/items?`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //bind method, that allows the user to upload a file to the webpage.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should only be called once per "new writing" page.
  private bindDropUploadBox(): void {
    const Element = (<HTMLInputElement>this.domElement.querySelector('#NewDocument'));
    Element.addEventListener('change', () => {

      const ImageElement = (<HTMLImageElement>this.domElement.querySelector('#NewDocumentImage'))
      if (Element !== null && Element.files !== null && Element.files.length !== 0) {
        const file = Element.files[0];
        ImageElement.src = `${require('../../shared/assets/page.png')}`;
        (<HTMLElement>this.domElement.querySelector('#NewDocumentInstruction')).innerHTML = "";
        (<HTMLElement>this.domElement.querySelector('#NewDocumentTag')).innerHTML = "" + file.name;
      } else {
        ImageElement.src = `${require('../../shared/assets/upload.png')}`;
        (<HTMLElement>this.domElement.querySelector('#NewDocumentInstruction')).innerHTML = "Upload any .pdf files from desktop";
        (<HTMLElement>this.domElement.querySelector('#NewDocumentTag')).innerHTML = "click here to upload your .pdf file";
      }
    });
  }

  //bind method, that allows the user to view the available collections of a users, so they can upload a new version.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should only be called once per "new writing" page.
  // - TODO:      The available single selectors have not been dynbamically set yet.
  private bindCollectionSelector(): void {
    this.domElement.querySelector('#availableVersionCollections')?.addEventListener('click', () => {
      const value = (<HTMLSelectElement>this.domElement.querySelector('#availableVersionCollections')).value;
      if (value !== "NoCollection") {
        this.getSinglesFromCollectionID(value).then((response) => {
          let html: string = ``;
          response.value.forEach((item: Objects.ISingleListItem) => {
            html += `<option value="` + item.Title + `">` + item.SingleTitle + `</option>`
          })
          this.domElement.querySelector('#availableVersionSingles')!.innerHTML = html;
        }).catch((e) => { console.log(e) })
      } else {
        const html: string = `<option value="NoSingle">-----</option>`;
        this.domElement.querySelector('#availableVersionSingles')!.innerHTML = html;
      }
    });
  }

  //Get singles method that allows a full list of singles to be retrieved based off of the collectionID.
  // - Parameter: CID: string, The ID of a collection.
  // - Returns:   Promise of a list of single pieces of writing
  // - Example:   return getSinglesFromCollectionID("CID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private getSinglesFromCollectionID(CID: string): Promise<Objects.ISingleList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Singles')/items?$filter= CollectionID eq '` + CID + `'`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Render method for the list of writing items owned by the user.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   called once per my writing webpart instance.
  // - TODO:      The userID is generated based off of the username who is logged in, this needs to be changed once the login system has been implemented.
  private renderWritingsAsync(): void {
    const UserID = this.context.pageContext.user.displayName;
    this._getWritingsListdata(UserID)
      .then((response) => {
        this._renderWritingsList(response.value);
      })
      .catch((e) => { console.log(e) })
  }

  //Get method to get the list of writings owned by a user based off of the given UserID.
  // - Parameter: UserID: string, this is the user ID of the current user.
  // - Returns:   Promise of a list of writings
  // - Example:   return _getWritingsListdata("UID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private _getWritingsListdata(UserID: string): Promise<Objects.IWritingList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Writings')/items?$filter= Owner eq '` + UserID + `'& $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Render method for the list of writing items owned by the user.
  //These writing items will render in the same shape as the ones in the browse menu.
  // - Parameter: items: list of writings
  // - Returns:   Void
  // - Example:   called once in the response of the writings get method.
  private _renderWritingsList(items: Objects.IWritingListItem[]): void {
    let fictionHtml: string = '';
    let nonFictionHtml: string = '';
    let scriptsHtml: string = '';
    let poetryHtml: string = '';
    let otherHtml: string = '';

    items.forEach((item: Objects.IWritingListItem) => {
      let html: string = ``;
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
      html += `
                <div
                  style="overflow: hidden; position: absolute; height: 30%; width: 100%; `;
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
      switch (item.Writingtype) {
        case "Fiction":
          fictionHtml += html;
          break;
        case "Nonfiction":
          nonFictionHtml += html;
          break;
        case "Poetry":
          poetryHtml += html;
          break;
        case "Scripts":
          scriptsHtml += html;
          break;
        case "Other":
        default:
          otherHtml += html;
          break;
      }
    })

    this.domElement.querySelector('#FictionExploreContainer')!.innerHTML = fictionHtml;
    this.domElement.querySelector('#NonfictionExploreContainer')!.innerHTML = nonFictionHtml;
    this.domElement.querySelector('#ScriptsExploreContainer')!.innerHTML = scriptsHtml;
    this.domElement.querySelector('#PoetryExploreContainer')!.innerHTML = poetryHtml;
    this.domElement.querySelector('#OtherExploreContainer')!.innerHTML = otherHtml;
  }

  //Button binding group method to bind the buttons of the my writings webpart.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should only be called once after the inner html of the webpart has been rendered.
  private bindButtons(): void {
    this.bindBackButtons();
    this.bindNewWritingButton();
    this.bindAddNewWritingButton();
  }

  //Button binding method to bind the back button from the "new writings" part of the my writings webpart.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should only be called once after the "new writing" button has been rendered into the inner html of the webpart.
  private bindBackButtons(): void {
    this.domElement.querySelector('#NewWritingBackButton')?.addEventListener('click', () => {
      (<HTMLElement>this.domElement.querySelector('#NewWritingForm')).style.display = "none";
      (<HTMLElement>this.domElement.querySelector('#OwnedOverview')).style.display = "block";
      this.emptyAddWritingFields();
    })
  }

  //Button binding method to bind the redirect button to the "new writings" part of the my writings webpart.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should only be called once after the "new writing" button has been rendered into the inner html of the webpart.
  private bindNewWritingButton(): void {
    this.domElement.querySelector('#NewWritingButton')?.addEventListener('click', () => {
      (<HTMLElement>this.domElement.querySelector('#NewWritingForm')).style.display = "block";
      (<HTMLElement>this.domElement.querySelector('#OwnedOverview')).style.display = "none";
    })
  }

  //Button binding method to bind the post writing button. this button posts the corresponding information to the correct lists with the given values
  //This method also error handles in case information has not been filled in.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should only be called once after the "new writing" html has been rendered into the inner html of the webpart.
  private bindAddNewWritingButton(): void {
    this.domElement.querySelector('#PostNewWritingButton')?.addEventListener('click', () => {
      const VersionCollection = (<HTMLSelectElement>this.domElement.querySelector('#availableVersionCollections')).value;
      const VersionSingle = (<HTMLSelectElement>this.domElement.querySelector('#availableVersionSingles')).value;
      const NewVersionName = (<HTMLInputElement>this.domElement.querySelector('#NewVersionName')).value;
      const NewSingleName = (<HTMLInputElement>this.domElement.querySelector('#NewSingleName')).value;
      const NewSingleDescription = (<HTMLTextAreaElement>this.domElement.querySelector('#NewSingleDescription')).value;
      const Visibility = (<HTMLSelectElement>this.domElement.querySelector('#Visibility')).value;
      const SingleType = (<HTMLSelectElement>this.domElement.querySelector('#SingleType')).value;
      const SingleState = (<HTMLSelectElement>this.domElement.querySelector('#SingleState')).value;
      const NewDocument = (<HTMLInputElement>this.domElement.querySelector('#NewDocument')).files;
      const chosenCollection = (<HTMLSelectElement>this.domElement.querySelector('#availableCollections')).value;
      const NewCollectionName = (<HTMLInputElement>this.domElement.querySelector('#NewCollectionName')).value;
      const CollectionType = (<HTMLSelectElement>this.domElement.querySelector('#CollectionType')).value;
      const NewCollectionDescription = (<HTMLTextAreaElement>this.domElement.querySelector('#NewCollectionDescription')).value;
      const NewVersionCheck = (<HTMLInputElement>this.domElement.querySelector('#IsNewVersionCheckBox')).checked;
      const PartCollectionCheck = (<HTMLInputElement>this.domElement.querySelector('#IsPartOfCollectionCheckBox')).checked;
      const includedSingleTriggers = [].slice.call((<HTMLDivElement>this.domElement.querySelector('#includedTriggersSingle')).getElementsByTagName('*'), 0);
      const includedCollectionTriggers = [].slice.call((<HTMLDivElement>this.domElement.querySelector('#includedTriggersCollection')).getElementsByTagName('*'), 0);
      const includedSingleTags = [].slice.call((<HTMLDivElement>this.domElement.querySelector('#includedTagsSingle')).getElementsByTagName('*'), 0);
      const includedCollectionTags = [].slice.call((<HTMLDivElement>this.domElement.querySelector('#includedTagsCollection')).getElementsByTagName('*'), 0);
      const includedSingleGenres = [].slice.call((<HTMLDivElement>this.domElement.querySelector('#includedGenresSingle')).getElementsByTagName('*'), 0);
      const includedCollectionGenres = [].slice.call((<HTMLDivElement>this.domElement.querySelector('#includedGenresCollection')).getElementsByTagName('*'), 0);
      const AllFeedback = (<HTMLInputElement>this.domElement.querySelector('#AllFeedback'));
      const Questions = (<HTMLInputElement>this.domElement.querySelector('#QAFeedback'));
      const QuestionsCollection = [].slice.call((<HTMLDivElement>this.domElement.querySelector('#includedQuestions')).getElementsByTagName('*'), 0);


      if (NewVersionCheck === true) {
        if (NewVersionName !== "" && NewDocument?.length !== 0 && NewDocument !== null && VersionSingle !== "NoSingle" && VersionCollection !== "NoCollection") {
          this.getNextListItemID("Versions", "VID").then((responseVersionID) => {
            this.postNewVersion(NewVersionName, VersionSingle, NewDocument[0], responseVersionID);
            if (AllFeedback.checked && Questions.checked && QuestionsCollection.length > 0) {
              this.postNewQuestion(responseVersionID, QuestionsCollection, 0);
            }
            this.postNewFeedbackSettings(responseVersionID, AllFeedback.checked, Questions.checked);
            (<HTMLElement>this.domElement.querySelector('#NewWritingForm')).style.display = "none";
            (<HTMLElement>this.domElement.querySelector('#OwnedOverview')).style.display = "block";
            this.emptyAddWritingFields();
          }).catch((e) => { console.log(e) });

        } else {
          alert("Not all required fields for a new version have been filled in.")
          return;
        }
      } else {
        if (NewSingleName !== "" && NewSingleDescription !== "" && NewDocument?.length !== 0 && NewDocument !== null) {
          //This portion is for saving to a collection
          if (PartCollectionCheck === true) {
            if (chosenCollection === "NewCollection") {
              //This portion is about posting a new collection and single
              if (NewCollectionName !== "" && NewCollectionDescription !== "") {
                this.getNextListItemID("Collections", "CID").then((responseCollectionID) => {
                  this.postNewCollection(NewCollectionName, NewCollectionDescription, responseCollectionID);
                  this.postNewWriting(NewCollectionName, NewCollectionDescription, "Collection", CollectionType, "", Visibility, responseCollectionID, includedCollectionTriggers, includedCollectionTags, includedCollectionGenres).then((response) => {
                    this.getNextListItemID("Singles", "SID").then((responseSingleID) => {
                      this.postNewSingle(NewSingleName, NewSingleDescription, responseCollectionID, responseSingleID);
                      this.postNewWriting(NewSingleName, NewSingleDescription, "Single", SingleType, SingleState, Visibility, responseSingleID, includedSingleTriggers, includedSingleTags, includedSingleGenres);
                      this.getNextListItemID("Versions", "VID").then((responseVersionID) => {
                        this.postNewVersion(NewVersionName, responseSingleID, NewDocument[0], responseVersionID);
                        if (AllFeedback.checked && Questions.checked && QuestionsCollection.length > 0) {
                          this.postNewQuestion(responseVersionID, QuestionsCollection, 0);
                        }
                        this.postNewFeedbackSettings(responseVersionID, AllFeedback.checked, Questions.checked);
                        (<HTMLElement>this.domElement.querySelector('#NewWritingForm')).style.display = "none";
                        (<HTMLElement>this.domElement.querySelector('#OwnedOverview')).style.display = "block";
                        this.emptyAddWritingFields();
                      }).catch((e) => { console.log(e) });
                    }).catch((e) => { console.log(e) });
                  }).catch((e) => { console.log(e) });
                }).catch((e) => { console.log(e) });
              } else {
                alert("Not all required fields for a new piece collection have been filled in.")
                return;
              }
            } else {
              //This portion is about posting a single to an existing collection
              if (chosenCollection !== "NoCollection") {
                this.getNextListItemID("Singles", "SID").then((responseSingleID) => {
                  this.postNewSingle(NewSingleName, NewSingleDescription, chosenCollection, responseSingleID);
                  this.postNewWriting(NewSingleName, NewSingleDescription, "Single", SingleType, SingleState, Visibility, responseSingleID, includedSingleTriggers, includedSingleTags, includedSingleGenres);
                  this.getNextListItemID("Versions", "VID").then((responseVersionID) => {
                    this.postNewVersion(NewVersionName, responseSingleID, NewDocument[0], responseVersionID);
                    if (AllFeedback.checked && Questions.checked && QuestionsCollection.length > 0) {
                      this.postNewQuestion(responseVersionID, QuestionsCollection, 0);
                    }
                    this.postNewFeedbackSettings(responseVersionID, AllFeedback.checked, Questions.checked);
                    (<HTMLElement>this.domElement.querySelector('#NewWritingForm')).style.display = "none";
                    (<HTMLElement>this.domElement.querySelector('#OwnedOverview')).style.display = "block";
                    this.emptyAddWritingFields();
                  }).catch((e) => { console.log(e) });
                }).catch((e) => { console.log(e) });
                //TODO: update the collection writing with a new last updated
              } else {
                alert("No collection has been assigned to this piece of writing")
                return;
              }
            }
          } else {
            //This portion is for saving to only a new single
            this.getNextListItemID("Singles", "SID").then((responseSingleID) => {
              this.postNewSingle(NewSingleName, NewSingleDescription, "", responseSingleID);
              this.postNewWriting(NewSingleName, NewSingleDescription, "Single", SingleType, SingleState, Visibility, responseSingleID, includedSingleTriggers, includedSingleTags, includedSingleGenres);
              this.getNextListItemID("Versions", "VID").then((responseVersionID) => {
                this.postNewVersion(NewVersionName, responseSingleID, NewDocument[0], responseVersionID);
                if (AllFeedback.checked && Questions.checked && QuestionsCollection.length > 0) {
                  this.postNewQuestion(responseVersionID, QuestionsCollection, 0);
                }
                this.postNewFeedbackSettings(responseVersionID, AllFeedback.checked, Questions.checked);
                (<HTMLElement>this.domElement.querySelector('#NewWritingForm')).style.display = "none";
                (<HTMLElement>this.domElement.querySelector('#OwnedOverview')).style.display = "block";
                this.emptyAddWritingFields();
              }).catch((e) => { console.log(e) })
            }).catch((e) => { console.log(e) })
          }
        } else {
          alert("Not all required fields for a new piece of writing have been filled in.")
          return;
        }
      }


    })
  }

  //Post/Add method for a new collection.
  // - Parameter: NewCollectionName: string, this is the new name of the new collection.
  // - Parameter: NewCollectionDescription: string, this is the new description of the new collection.
  // - Parameter: CollectionID: string, this is the new collection ID of the new collection.
  // - Returns:   Void
  // - Example:   should be called in the bindAddNewWritingButton function whenever a new collection needs to be added. 
  private postNewCollection(NewCollectionName: string, NewCollectionDescription: string, CollectionID: string): void {
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
      .then((response: SPHttpClientResponse) => {
      }).catch((e) => { console.log(e) });
  }

  //Post/Add method for a new version.
  // - Parameter: NewVersionName: string, this is the new version name of the new version.
  // - Parameter: VersionSingle: string, this is the new singleID of the new version.
  // - Parameter: Document: File, this is the file that needs to be attached to the new version.
  // - Parameter: VersionID: string, This is the new ID for the new version.
  // - Returns:   Void
  // - Example:   should be called in the bindAddNewWritingButton function whenever a new version needs to be added. 
  private postNewVersion(NewVersionName: string, VersionSingle: string, Document: File, VersionID: string): void {
    const VersionSiteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Versions')/Items"
    const NewVersion: any = {
      "Title": VersionID,
      "SingleID": VersionSingle,
      "VersionName": NewVersionName
    }
    const spHttpClientOptions: ISPHttpClientOptions = {
      "body": JSON.stringify(NewVersion)
    }
    this.context.spHttpClient.post((VersionSiteUrl), SPHttpClient.configurations.v1, spHttpClientOptions)
      .then((response: SPHttpClientResponse) => {
        this.postNewDocument(Document, VersionID);
      }).catch((e) => { console.log(e) });
  }

  //Post/Add method for a new single piece of writing.
  // - Parameter: NewSingleName: string, this is the new name of the new single piece of writing.
  // - Parameter: NewSingleDescription: string, this is the new description of the new single piece of writing.
  // - Parameter: chosenCollection: File, this is the collection ID of the new single piece of writing.
  // - Parameter: SingleID: string, This is the new ID for the new single.
  // - Returns:   Void
  // - Example:   should be called in the bindAddNewWritingButton function whenever a new single piece of writing needs to be added. 
  private postNewSingle(NewSingleName: string, NewSingleDescription: string, chosenCollection: string, SingleID: string): void {
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
      .then((response: SPHttpClientResponse) => {
      }).catch((e) => { console.log(e) });
  }

  //Post/Add method for a new writing.
  // - Parameter: NewName: string, this is the new name of the new Writing.
  // - Parameter: NewDescription: string, this is the new description of the new Writing .
  // - Parameter: WorkType: File, this value determines whether a writing is a single or collection.
  // - Parameter: WritingType: string, This value dertemines which of the 5 types the new writing is. 
  // - Parameter: State: string, This value determines what state the writing is in.
  // - Parameter: Visibility: string, This value determines how visible the writing is.
  // - Parameter: Reference: string, This value holds the collectionID or SingleID, this should correspond with the given worktype.
  // - Parameter: Triggers: any, This is the list of included triggers of the new Writing.
  // - Parameter: Tags: any, This is the list of included tags of the new Writing.
  // - Parameter: Genres: any, This is the list of included genres of the new Writing.
  // - Returns:   Promise of a string, the writing ID of the new Writing
  // - Example:   should be called in the bindAddNewWritingButton function whenever a new writing needs to be added. 
  private postNewWriting(NewName: string, NewDescription: string, WorkType: string, WritingType: string, State: string, Visibility: string, Reference: string, Triggers: any, Tags: any, Genres: any): Promise<string | void> {
    return this.getNextListItemID("Writings", "WID").then((response) => {
      const WritingSiteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Writings')/Items"
      const UserID = this.context.pageContext.user.displayName;
      let triggers = ""
      Triggers.forEach((Trigger: HTMLElement) => {
        triggers += Trigger.innerHTML + ", ";
      })
      let tags = ""
      Tags.forEach((Tag: HTMLElement) => {
        tags += Tag.innerHTML + ", ";
      })
      let genres = ""
      Genres.forEach((Genre: HTMLElement) => {
        genres += Genre.innerHTML + ", ";
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
      return this.context.spHttpClient.post((WritingSiteUrl), SPHttpClient.configurations.v1, spHttpClientOptions)
        .then((response: SPHttpClientResponse) => {
          this.ReloadOwnedWriting();
          return "";
        }).catch((e) => {
          console.log(e);
          return "";
        });
    }).catch((e) => { console.log(e) })
  }

  //Post/Add recursive method for a new question in a list of questions.
  //This method loops through the list of new questions and posts each of them before handing the next position to the next method call.
  // - Parameter: VersionID: string, this is the version ID the new question is connected to.
  // - Parameter: QuestionCollection: any, this is the list of new questions.
  // - Parameter: position: number, this is the position of the next potentially new question.
  // - Returns:   Void
  // - Example:   should be called once when there are questions connected to a new version. 
  //              this method is also called whenever for each question in the collection after position 0, this is done recursivly
  private postNewQuestion(VersionID: string, QuestionCollection: any, position: number): void {
    this.getNextListItemID("Questions", "QID").then((responseQuestionID) => {
      const QuestionSiteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Questions')/Items"
      const NewQuestion: any = {
        "Title": responseQuestionID,
        "Question": QuestionCollection[position].innerHTML,
        "VersionID": VersionID
      }
      const spHttpClientOptions: ISPHttpClientOptions = {
        "body": JSON.stringify(NewQuestion)
      }
      this.context.spHttpClient.post((QuestionSiteUrl), SPHttpClient.configurations.v1, spHttpClientOptions)
        .then((response: SPHttpClientResponse) => {
          const nextposition = position + 1;
          if (nextposition !== QuestionCollection.length) {
            this.postNewQuestion(VersionID, QuestionCollection, nextposition);
          }
        }).catch((e) => { console.log(e) });
    }).catch((e) => { console.log(e) });
  }

  //Post/Add method for a new feedback settings for a new version.
  // - Parameter: VersionID: string, this is the version ID of the new version which these settings are connected to.
  // - Parameter: AllowFeedback: boolean, this is the value for whether any feedback is allowed.
  // - Parameter: AllowQuestions: boolean, this is the value for whether questions are allowed.
  // - Returns:   Void
  // - Example:   should be called in the bindAddNewWritingButton function whenever a new feedback settings needs to be added. 
  private postNewFeedbackSettings(VersionID: string, AllowFeedback: boolean, AllowQuestions: boolean):void {
    this.getNextListItemID("FeedbackSettings", "FSID").then((responseFeedbackSettingsnID) => {
      const QuestionSiteUrl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('FeedbackSettings')/Items"
      const AllowVisible = (<HTMLInputElement>this.domElement.querySelector('#VisibleFeedback'));
      const AllowComments = (<HTMLInputElement>this.domElement.querySelector('#CommentsFeedback'));
      const AllowFormalFeedback = (<HTMLInputElement>this.domElement.querySelector('#FormalFeedback'));
      const AllowInline = (<HTMLInputElement>this.domElement.querySelector('#InlineFeedback'));

      const NewFeedbackSettings: any = {
        "Title": "" + responseFeedbackSettingsnID,
        "AllowAllFeedback": "" + AllowFeedback,
        "AllowVisibleFeedback": "" + AllowVisible.checked,
        "AllowComments": "" + AllowComments.checked,
        "AllowFormalFeedback": "" + AllowFormalFeedback.checked,
        "AllowQuestions": "" + AllowQuestions,
        "AllowInline": "" + AllowInline.checked,
        "VersionID": "" + VersionID
      }
      const spHttpClientOptions: ISPHttpClientOptions = {
        "body": JSON.stringify(NewFeedbackSettings)
      }
      this.context.spHttpClient.post((QuestionSiteUrl), SPHttpClient.configurations.v1, spHttpClientOptions)
        .then((response: SPHttpClientResponse) => {

        }).catch((e) => { console.log(e) });

    });
  }

  //reload method to reload the owned writing after a new one has been added.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   this method should only be called after posting a new form of writing.
  // - TODO:      This method may become obsoleet if nothing gets added later on. 
  private ReloadOwnedWriting(): void {
    this.renderWritingsAsync();
  }

  //Get method for the sharepointID of a list of a certain Item ID.
  // - Parameter: ItemID: string, this is the generated ID of the item.
  // - Parameter: ListName: string, this is the listname of the item.
  // - Returns:   Promise of a ItemID list, this will contain the sharepointID of an item.
  private getLitsItemID(ItemID: string, ListName: string): Promise<Objects.IIDList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('` + ListName + `')/items?$filter= Title eq '` + ItemID + `'&$select=ID`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Post/Add method for attaching the file to a given version.
  // - Parameter: file: any, this is the file that needs to be attached to the new version.
  // - Parameter: QID: string, this is the ID of the new version.
  // - Returns:   Void
  // - Example:   Follows the binding of the save new writing button. 
  private postNewDocument(file: any, VersionID: string): void {
    this.getLitsItemID(VersionID, "Versions").then((response) => {
      const Options: ISPHttpClientOptions = {
        headers: {
          "Accept": "application/json",
          "Content-type": "application.json"
        },
        body: file
      };
      const url: string = this.context.pageContext.site.absoluteUrl + `/_api/web/lists/getbytitle('Versions')/items(` + response.value[0].ID + `)/AttachmentFiles/add(Filename='${file.name}')`
      this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, Options).then((response: SPHttpClientResponse) => {
      }).catch((e) => { console.log(e) })
    }).catch((e) => { console.log(e) });
  }

  //Preperation method to clear all the fields in the "new writings" view of the webpart.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   this method should only be called after all the data has been saved to the sharepoint.
  // - TODO:      This method may have missed a fields or two, this needs to be checked. 
  private emptyAddWritingFields(): void {
    (<HTMLSelectElement>this.domElement.querySelector('#availableVersionCollections')).selectedIndex = 0;
    (<HTMLSelectElement>this.domElement.querySelector('#availableVersionSingles')).selectedIndex = 0;
    (<HTMLInputElement>this.domElement.querySelector('#NewVersionName')).value = "";
    (<HTMLInputElement>this.domElement.querySelector('#NewSingleName')).value = "";
    (<HTMLTextAreaElement>this.domElement.querySelector('#NewSingleDescription')).value = "";
    (<HTMLSelectElement>this.domElement.querySelector('#Visibility')).selectedIndex = 0;
    (<HTMLSelectElement>this.domElement.querySelector('#SingleType')).selectedIndex = 0;
    (<HTMLSelectElement>this.domElement.querySelector('#SingleState')).selectedIndex = 0;
    (<HTMLInputElement>this.domElement.querySelector('#NewDocument')).value = "";
    (<HTMLSelectElement>this.domElement.querySelector('#availableCollections')).selectedIndex = 0;
    (<HTMLInputElement>this.domElement.querySelector('#NewCollectionName')).value = "";
    (<HTMLSelectElement>this.domElement.querySelector('#CollectionType')).selectedIndex = 0;
    (<HTMLTextAreaElement>this.domElement.querySelector('#NewCollectionDescription')).value = "";
    (<HTMLInputElement>this.domElement.querySelector('#VisibleFeedback')).checked = false;
    (<HTMLInputElement>this.domElement.querySelector('#CommentsFeedback')).checked = false;
    (<HTMLInputElement>this.domElement.querySelector('#FormalFeedback')).checked = false;
    (<HTMLInputElement>this.domElement.querySelector('#InlineFeedback')).checked = false;
    (<HTMLInputElement>this.domElement.querySelector('#AllFeedback')).checked = false;
    (<HTMLInputElement>this.domElement.querySelector('#QAFeedback')).checked = false;
    (<HTMLElement>this.domElement.querySelector('#includedQuestions')).innerHTML = "";
  }

  //Checkbox binding method to bind the checkboxes that open or close certain parts of the new writing form.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should only be called once after the checkboxes have all been rendered.
  private bindNewWritingCheckboxes(): void {
    this.domElement.querySelector('#IsNewVersionCheckBox')?.addEventListener('click', () => {
      const element = <HTMLInputElement>this.domElement.querySelector('#IsNewVersionCheckBox');
      if (element && element.checked) {
        (<HTMLElement>this.domElement.querySelector('#NewVersionFields')).style.display = "block";
        (<HTMLInputElement>this.domElement.querySelector('#IsPartOfCollectionCheckBox')).checked = false;
        (<HTMLElement>this.domElement.querySelector('#NewSingleFields')).style.display = "none";
      } else if (element && !element.checked) {
        (<HTMLElement>this.domElement.querySelector('#NewVersionFields')).style.display = "none";
        (<HTMLElement>this.domElement.querySelector('#NewSingleFields')).style.display = "block";
      }
    })

    this.domElement.querySelector('#IsPartOfCollectionCheckBox')?.addEventListener('click', () => {
      const element = <HTMLInputElement>this.domElement.querySelector('#IsPartOfCollectionCheckBox');
      if (element && element.checked) {
        (<HTMLElement>this.domElement.querySelector('#PartOfCollectionFields')).style.display = "block";
      } else if (element && !element.checked) {
        (<HTMLElement>this.domElement.querySelector('#PartOfCollectionFields')).style.display = "none";
      }
    })
  }

  //Populate method for the available collections selector with the users owned collections.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should only be called when the available collections Selector has been rendered in.
  // - TODO:      This method may be obsoleet if nothing gets added in the future.
  private populateAddWritingCollectionSelectors(): void {
    this._renderCollectionAsync(this.context.pageContext.user.displayName);
  }

  //Async render flow method to render the collections of a given user in the selector.
  // - Parameter: UserID: string, this is the ID of the user.
  // - Returns:   Void
  // - Example:   This method should be called once after the selector has been rendered in.
  private _renderCollectionAsync(UserID: string): void {
    this._getCollectionListdata(UserID)
      .then((response) => {
        this._renderCollection(response.value);
      })
      .catch((e) => { console.log(e) })
  }

  //Get method for the collections list containing the current users owned collections.
  // - Parameter: UserID: string, this is the user ID of the current user
  // - Returns:   Promise of a ICollectionList, this will contain the information of the owned collections
  // - Example:   can be used to get the collection of a given user
  //              return _getCollectionListdata("UID-1").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private _getCollectionListdata(UserID: string): Promise<Objects.ICollectionList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Collections')/items?$filter= OwnerID eq '` + UserID + `' & $orderby= TimeCreated desc & $select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles `, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

  //Render method for the collections owned by a user in the selector of the "new writings" view.
  // - Parameter: items: a list of ICollectionListItems, this is the list of collections of a single user.
  // - Returns:   Void
  // - Example:   used in the .then((response)=>{}) portion of a collection Get method.
  private _renderCollection(items: Objects.ICollectionListItem[]): void {
    let html: string = `<option value="NoCollection">None</option>`;
    const add: string = `<option value="NewCollection">Make a new Collection</option>`;
    items.forEach((item: Objects.ICollectionListItem) => {
      html += `<option value="` + item.Title + `">` + item.CollectionTitle + `</option>`
    });
    this.domElement.querySelector('#availableVersionCollections')!.innerHTML = html;
    this.domElement.querySelector('#availableCollections')!.innerHTML = html + add;
    this.bindNewCollectionSelector();

  }

  //Selector binding method to bind the selector for the avaialable collections, so it opens the correct parts of the new writing form.
  // - Parameter: None
  // - Returns:   Void
  // - Example:   This method should only be called once after the available collections selector has been rendered in.
  private bindNewCollectionSelector(): void {
    this.domElement.querySelector('#availableCollections')?.addEventListener('click', () => {
      const element = <HTMLSelectElement>this.domElement.querySelector('#availableCollections');
      if (element && element.value === "NewCollection") {
        (<HTMLElement>this.domElement.querySelector('#NewCollectionFields')).style.display = "block";
      } else {
        (<HTMLElement>this.domElement.querySelector('#NewCollectionFields')).style.display = "none";
      }
    });
  }

  //Get method for the following Listitem ID based off of the listname and the ID prefix.
  // - Parameter: ListName: string, this is the name of a sharepoint list for which the next ID needs to be found.
  // - Parameter: IDPrefix: string, this is prefix for the ID, example: "UID-" for any User ID
  // - Returns:   Promise of a string, this will contain the next possible ID of the given list.
  // - Example:   return getNextListItemID("Versions", "VID-").then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private getNextListItemID(ListName: string, IDPrefix: string): Promise<string> {
    return this._getIDListdata(ListName).then((response) => {
      let ID: string = IDPrefix + "-1";
      if (response.value.length !== 0) {
        const NewestID = response.value[0].Title;
        const replacement = IDPrefix + "-"
        const substring = NewestID.replace(replacement, "");
        let IDnumber = parseInt(substring);
        IDnumber++;
        ID = IDPrefix + "-" + IDnumber;
        return ID;
      } else {
        return ID;
      }
    })
  }

  //Get method for the last inserted item to retrieve the ID of the last inserted item.
  // - Parameter: ListName: string, this is the name of the list
  // - Returns:   Promise of a IIDList, this will contain the information of the last ID in the given list.
  // - Example:   return _getIDListdata("Versions).then((response)=>{//Do something}).catch((e)=>{console.log(e)});
  private _getIDListdata(ListName: string): Promise<Objects.IIDList> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('` + ListName + `')/items?$select=ID, Title&$orderby=ID desc&$top= 1`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .catch(() => { return });
  }

}
