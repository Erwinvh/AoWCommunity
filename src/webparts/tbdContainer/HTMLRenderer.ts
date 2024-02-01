import styles from './TbdContainerWebPart.module.scss';

export default class HTMLRenderer{

public RenderOwnedpiecesOverview():string{
    const html: string = `
    <div id="OwnedOverview" style="display:block; height:100%; overflow-y: hidden;">
        <div id="topbar" style="height:15%;">`
        +this.RenderTopBar()
        +`</div>
       <br><br><div style="height:80%; overflow-y: scroll;">`
       +this.RenderCatagorieOwnedWriting("Fiction")
       +this.RenderCatagorieOwnedWriting("Nonfiction")
       +this.RenderCatagorieOwnedWriting("Scripts")
       +this.RenderCatagorieOwnedWriting("Poetry")
       +this.RenderCatagorieOwnedWriting("Other")
    +`</div>
    </div>`
    return html;
}

private RenderTopBar():string{
 const html:string = `
    <div style="float: left;">
        <label for="Sorting">Sort by: </label>
        <select id="Sorting" name="Sorting">
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
            <option value="MostViewed">Most viewed</option>
            <option value="LeastViewed">Least viewed</option>
            <option value="MostFeedback">Most feedbacked</option>
            <option value="LeastFeedback">Least feedbacked</option>
        </select>        
        <h1 id="TitleField" style="text-align: center;">My writings</h1>
    </div>
    <div class="${styles.searchContainer}" style=" margin-left:5%; float: left;">
        <form action="/action_page.php">
            <input type="text" placeholder="Search.." name="search">
        </form>
    </div>
    <div style=" margin-left:5%; float: right;">
        <button id="NewWritingButton">New + </button>
    </div>
<br><br>`
return html;
}

private RenderCatagorieOwnedWriting(Category: string):string{
    let html:string = `<button type="button" class="${styles.collapsible}" style="`
    switch(Category){
        case "Fiction":
            html+=`background-color: #0092d2;`
            break;
        case "Nonfiction":
            html+=`background-color: #e4341c;`
            break;
        case "Poetry":
            html+=`background-color: #77c700 ;`
            break;
        case "Scripts":
            html+=`background-color: #f0bd24;`
            break;
        case "Other":
        default:
            html+=`background-color: #931eb8;`
            break;
    }
    html+=`"
    onclick="
    if(document.getElementById('`+Category+`ContentContainer').style.display == 'none'){
        document.getElementById('`+Category+`ContentContainer').style.display = 'block';
    }else{
        document.getElementById('`+Category+`ContentContainer').style.display = 'none';
    }
    ">`+Category+`</button>
    <div id="`+Category+`ContentContainer" class="${styles.OwnedWritingContentContainer}" style="display: none;">
      <div id="`+Category+`ExploreContainer" class="${styles.OwnedWritingContainer} ${styles.item3}">

      </div>
    </div>`
    return html;
}

public RenderNewWritingForm():string{
    const html:string = `
    <div id="NewWritingForm" style=" height: 100%; display:none; overflow-y: hidden">`
        +this.RenderNewWritingTop()
        +this.RenderNewWritingFormContainer()
    +`</div>`
    return html;
}

private RenderNewWritingTop():string{
    const html:string = `
    <div id="NewWritingTop" style="height: 10%;">
        <button id="NewWritingBackButton" class="${styles.backButtons}">Back</button>
        <h1 id="TitleContainer">New writing</h1>
    </div>`
    return html;
}

private RenderNewWritingFormContainer():string{
    const html:string = `
    <div id="NewWritingFormContainer" style="height: 80%; overflow-y: scroll;">`
        +this.RenderBaseInfoFields()
    +`</div>`
    return html;
}

private RenderBaseInfoFields():string{
    const html:string = `
    <div id="BaseInfoFields">
        <div class="${styles.row}">
            <label >Is a new version of an existing piece
                <input id="IsNewVersionCheckBox" type="checkbox">
            </label>
        </div>`
        +this.RenderNewVersionArea()
        +`<div id="NewSingleFields" style="display: block;">
            `+this.RenderCollectionFields()
            +`
            <div class="${styles.row}">
            <label class="${styles.col25}" for="NewSingleName">Writing title</label>
            <div class="${styles.col75}">
            <input class="${styles.inputBox}" type="text" id="NewSingleName" name="NewSingleName" placeholder="New Title..">
            </div>
            </div>
            <div class="${styles.row}">
            <label class="${styles.col25}" for="NewSingleVersionName">Version name</label>
            <div class="${styles.col75}">
            <input class="${styles.inputBox}" type="text" id="NewSingleVersionName" name="NewSingleVersionName" placeholder="New version name..">
            </div>
            </div>
            <div class="${styles.row}">
            <label class="${styles.col25}" for="NewSingleDescription">Writing Description</label>
            <textarea class="${styles.col75} ${styles.inputBox}" id="NewSingleDescription" name="NewSingleDescription" placeholder="Write something.." style="height:200px">
            </textarea>
            </div>
            <div class="${styles.row}">
            <label class="${styles.col25}">Writing visibility</label>
            <select class="${styles.col75} ${styles.inputBox}" id="Visibility" name="Visibility">
                <option value="Public">Public</option>
                <option value="Private">Private</option>
            </select>
            </div>
            <div class="${styles.row}">
            <label class="${styles.col25}">Writing Type</label>
            <select class="${styles.col75} ${styles.inputBox}" id="SingleType" name="SingleType">
                <option value="Fiction">Fiction</option>
                <option value="Nonfiction">Non-fiction</option>
                <option value="Poetry">Poetry</option>
                <option value="Scripts">Scripts</option>
                <option value="Other">Other</option>
            </select>
            </div>
            <div class="${styles.row}">
            <label class="${styles.col25}">Writing state</label>
            <select class="${styles.col75} ${styles.inputBox}" id="SingleState" name="SingleState">
                <option value="Rough draft">Rough draft</option>
                <option value="draft">Draft</option>
                <option value="Final draft">Final draft</option>
                <option value="Finished">Finished</option>
            </select>
            </div>
            <div class="${styles.row}">
                <label class="${styles.col25}">Writing Triggers</label>
                <div class="${styles.col75} ">
                    <div class="${styles.GTTGridContainer}">
                        <div>
                            <h5>Excluded triggers</h5>
                        </div>
                        <div>
                        </div>
                        <div>
                            <h5>Excluded triggers</h5>
                        </div>
                        <div id="excludedTriggersSingle" class="${styles.GTTScrollContainer}">

                        </div>
                        <div id="ControlsTriggersSingle">
                            <div id="SelectedSingleTriggersGTTItemID" hidden></div>
                            <div id="SelectedSingleTriggersGTTItemName" hidden></div>
                            <div id="SelectedSingleTriggersGTTItemParent" hidden></div>
                            <button id="addTriggersSingle">Add</button>
                            <button id="removeTriggersSingle">Remove</button>
                        </div>
                        <div id="includedTriggersSingle" class="${styles.GTTScrollContainer}">

                        </div>
                    </div>
                </div>
            </div>
            <div class="${styles.row}">
                <label class="${styles.col25}">Writing Genres</label>
                <div class="${styles.col75} ">
                    <div class="${styles.GTTGridContainer}">
                        <div>
                            <h5>Excluded genres</h5>
                        </div>
                        <div>
                        </div>
                        <div>
                            <h5>Excluded genres</h5>
                        </div>
                        <div id="excludedGenresSingle" class="${styles.GTTScrollContainer}">

                        </div>
                        <div id="ControlsGenresSingle">
                            <div id="SelectedSingleGenresGTTItemID" hidden></div>
                            <div id="SelectedSingleGenresGTTItemName" hidden></div>
                            <div id="SelectedSingleGenresGTTItemParent" hidden></div>
                            <button id="addGenresSingle">Add</button>
                            <button id="removeGenresSingle">Remove</button>
                        </div>
                        <div id="includedGenresSingle" class="${styles.GTTScrollContainer}">

                        </div>
                    </div>
                </div>
            </div>
            <div class="${styles.row}">
                <label class="${styles.col25}">Writing tags</label>
                <div class="${styles.col75} ">
                        <div class="${styles.GTTGridContainer}">
                            <div>
                                <h5>Excluded tags</h5>
                            </div>
                            <div>
                            </div>
                            <div>
                                <h5>Excluded tags</h5>
                            </div>
                            <div id="excludedTagsSingle" class="${styles.GTTScrollContainer}">

                            </div>
                            <div id="ControlsTagsSingle">
                                <div id="SelectedSingleTagsGTTItemID" hidden></div>
                                <div id="SelectedSingleTagsGTTItemName" hidden></div>
                                <div id="SelectedSingleTagsGTTItemParent" hidden></div>
                                <button id="addTagsSingle">Add</button>
                                <button id="removeTagsSingle">Remove</button>
                            </div>
                            <div id="includedTagsSingle" class="${styles.GTTScrollContainer}">

                            </div>
                        </div>
                    </div>
            </div>
            <div class="${styles.row}">
            <label class="${styles.col25}">Choose your pdf file </label>
            <div class="${styles.col75}">
            <label for="NewSingleDocument" id="NewSingleDocumentDropArea" class="${styles.dropArea}">
                <input type="file" accept=".pdf" id="NewSingleDocument" name="filename" hidden>
                <div class="${styles.uploadImage}">
                    <img id="NewSingleDocumentImage" src="${require('../../shared/assets/upload.png')}">
                    <p id="NewSingleDocumentTag">Click here to upload your .pdf file</p>
                    <span id="NewSingleDocumentInstruction">Upload any .pdf files from desktop</span>
                </div>
            </label>
            </div>
        </div>
    </div>
    <button id="PostNewWritingButton">Save and upload</button>`
    return html;
}

private RenderNewVersionArea():string{
 const html:string =`
 <div id="NewVersionFields" style="display: none;">
 <div class="${styles.row}">
     <label class="${styles.col25}" for="availableVersionCollections">Available Collections</label>
     <select class="${styles.col75} ${styles.inputBox}" id="availableVersionCollections" name="availableVersionCollections">
         <option value="No collection">None</option>
     </select>
 </div>
 <div class="${styles.row}">
     <label class="${styles.col25}" for="availableVersionSingles">Available works</label>
     <select class="${styles.col75} ${styles.inputBox}" id="availableVersionSingles" name="availableVersionSingles">
         <option value="NoSingle">-----</option>
     </select>
 </div>
 <div class="${styles.row}">
     <label class="${styles.col25}" for="NewVersionName">Version name</label>
     <div class="${styles.col75}">
         <input class="${styles.inputBox}" type="text" id="NewVersionName" name="NewVersionName" placeholder="New version name..">
     </div>
 </div>
 <div class="${styles.row}">
     <label class="${styles.col25}">Choose your pdf file </label>
     <div class="${styles.col75}">
        <label for="NewVersionDocument" id="NewVersionDocumentDropArea" class="${styles.dropArea}">
            <input type="file" accept=".pdf" id="NewVersionDocument" name="filename" hidden>
            <div class="${styles.uploadImage}">
                <img id="NewVersionDocumentImage" src="${require('../../shared/assets/upload.png')}">
                <p id="NewVersionDocumentTag">Click here to upload your .pdf file</p>
                <span id="NewVersionDocumentInstruction">Upload any .pdf files from desktop</span>
            </div>
        </label>
    </div>
 </div>
</div>
 `;
 return html;
}

private RenderCollectionFields():string{
    const html:string = `
    <div id="CollectionFields" style="border-bottom: double;">
        <label>Is part of a collection
            <input id="IsPartOfCollectionCheckBox" type="checkbox">
        </label>
        <div id="PartOfCollectionFields" style="display:none;">
            <div class="${styles.row}">
                <label class="${styles.col25}" for="availableCollections">Available collections</label>
                <select class="${styles.col75} ${styles.inputBox}" id="availableCollections" name="availableCollections">
                    <option value="NewCollection">Make a new Collection</option>
                </select>
            </div>
            <div id="NewCollectionFields" style="display:none;" >
                <div class="${styles.row}">
                    <label class="${styles.col25}" for="NewCollectionName">New collection name</label>
                    <div class="${styles.col75}">
                        <input class="${styles.inputBox}" type="text" id="NewCollectionName" name="NewCollectionName" placeholder="New collection name..">
                    </div>
                </div>
                <div class="${styles.row}">
                    <label class="${styles.col25}" for="CollectionType">Collection type</label>
                    <select class="${styles.col75} ${styles.inputBox}" id="CollectionType" name="CollectionType">
                        <option value="Fiction">Fiction</option>
                        <option value="Nonfiction">Non-fiction</option>
                        <option value="Poetry">Poetry</option>
                        <option value="Scripts">Scripts</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="${styles.row}">
                    <label class="${styles.col25}" for="NewCollectionDescription">Collection Description</label>
                    <textarea class="${styles.col75} ${styles.inputBox}" id="NewCollectionDescription" name="NewCollectionDescription" placeholder="Write something.." style="height:200px">
                    </textarea>
                </div>
                <div class="${styles.row}">
                    <label class="${styles.col25}">Collection triggers</label>
                    <div class="${styles.col75} ">
                    <div class="${styles.GTTGridContainer}">
                        <div>
                            <h5>Excluded triggers</h5>
                        </div>
                        <div>
                        </div>
                        <div>
                            <h5>Excluded triggers</h5>
                        </div>
                        <div id="excludedTriggersCollection" class="${styles.GTTScrollContainer}">

                        </div>
                        <div id="ControlsTriggersCollection">
                            <div id="SelectedCollectionTriggersGTTItemID" hidden></div>
                            <div id="SelectedCollectionTriggersGTTItemName" hidden></div>
                            <div id="SelectedCollectionTriggersGTTItemParent" hidden></div>
                            <button id="addTriggersCollection">Add</button>
                            <button id="removeTriggersCollection">Remove</button>
                        </div>
                        <div id="includedTriggersCollection" class="${styles.GTTScrollContainer}">

                        </div>
                    </div>
                </div>
                </div>
                <div class="${styles.row}">
                    <label class="${styles.col25}">Collection genres</label>
                    <div class="${styles.col75} ">
                    <div class="${styles.GTTGridContainer}">
                        <div>
                            <h5>Excluded genres</h5>
                        </div>
                        <div>
                        </div>
                        <div>
                            <h5>Excluded genres</h5>
                        </div>
                        <div id="excludedGenresCollection" class="${styles.GTTScrollContainer}">

                        </div>
                        <div id="ControlsGenresCollection">
                            <div id="SelectedCollectionGenresGTTItemID" hidden></div>
                            <div id="SelectedCollectionGenresGTTItemName" hidden></div>
                            <div id="SelectedCollectionGenresGTTItemParent" hidden></div>
                            <button id="addGenresCollection">Add</button>
                            <button id="removeGenresCollection">Remove</button>
                        </div>
                        <div id="includedGenresCollection" class="${styles.GTTScrollContainer}">

                        </div>
                    </div>
                </div>
                </div>
                <div class="${styles.row}">
                    <label class="${styles.col25}">Collection Tags</label>
                    <div class="${styles.col75} ">
                        <div class="${styles.GTTGridContainer}">
                            <div>
                                <h5>Excluded tags</h5>
                            </div>
                            <div>
                            </div>
                            <div>
                                <h5>Excluded tags</h5>
                            </div>
                            <div id="excludedTagsCollection" class="${styles.GTTScrollContainer}">

                            </div>
                            <div id="ControlsTagsCollection">
                                <div id="SelectedCollectionTagsGTTItemID" hidden></div>
                                <div id="SelectedCollectionTagsGTTItemName" hidden></div>
                                <div id="SelectedCollectionTagsGTTItemParent" hidden></div>
                                <button id="addTagsCollection">Add</button>
                                <button id="removeTagsCollection">Remove</button>
                            </div>
                            <div id="includedTagsCollection" class="${styles.GTTScrollContainer}">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    return html;
}

}