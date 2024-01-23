import styles from './TbdContainerWebPart.module.scss';

export default class HTMLRenderer{

public RenderCollectionOverview():string{
    let html: string = `
    <div id="CollectionOverview" style="display:none;">
    <h1 id="CollectionTitleField" style="text-align: center;">Title collection piece work</h1>

    <div class="${styles.topgrid}">
        <div class="${styles.uppergrid}">
            <div class="${styles.lowergrid}">
                <div class="${styles.descriptionitem}">
                    <h3>Description:</h3>
                    <pre id="CollectionOverviewDesc" style="text-align: center; white-space: pre-line; height: fit-content;">
    Lorem ipsum dolor sit amet, 
    consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    
    Ut enim ad minim veniam, 
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
    Excepteur sint occaecat cupidatat non proident, 
    sunt in culpa qui officia deserunt mollit anim id est laborum.</pre>
                </div>
                <div class="${styles.descriptionitem}">
                    <h3 id="CollectionSubdivisionTitle">Chapters/components:</h3>
                    <table id="CollectionSubdivisionTable">
                        <tr>
                            <th>Chapter/component:</th>
                            <th>Date:</th>
                            <th>Link:</th>
                        </tr>
                    </table>
                </div>
            </div>
            <div>
                <h3>Base statistics:</h3>
                <table>
                    <tr>
                        <th>Statistic:</th>
                        <th>Value:</th>
                    </tr>
                    <tr>
                        <td>Author(s):</td>
                        <td id="CollectionOwnerField">100</td>
                    </tr>
                    <tr>
                        <td>Views:</td>
                        <td id="CollectionViewField">100</td>
                    </tr>
                    <tr>
                        <td>Feedbackers:</td>
                        <td id="CollectionFeedbackersField">5</td>
                    </tr>
                    <tr>
                        <td>Likes:</td>
                        <td>NA</td>
                    </tr>
                    <tr>
                        <td>First version release date:</td>
                        <td id="CollectionFirstVersionDateField">2 months ago</td>
                    </tr>
                    <tr>
                        <td>Newest version release date:</td>
                        <td id="CollectionLastUpdateField">Today</td>
                    </tr>
                    <tr>
                        <td>Type:</td>
                        <td>Collection</td>
                    </tr>
                    <tr>
                    <td>Genre:</td>
                    <td id="CollectionGenreField">Test document</td>
                </tr>
            </table>

            <h3>Content triggers:</h3>
            <ul>
                <li id="CollectionTriggersField">Tigger1</li>
            </ul>
            <h3>Tags:</h3>
            <ul>
                <li id="CollectionTagsField">Tag1</li>
            </ul>
        </div>

    </div>
    <button id="latestSingleRedirectButton" data-Latest="NA" onclick="
    ">Go to latest version &rarr;</button>
</div>
</div>`


    return html;
}

public RenderSingleOverview():string{
    let html: string = `
    <div id="SingleOverview" style="display:none;">"
    <h1 id="SingleTitleField" style="text-align: center;">Title collection piece work</h1>


    <div class="${styles.topgrid}">

    <div class="${styles.uppergrid}">

        <div class="${styles.lowergrid}">

            <div class="${styles.descriptionitem}">
                <h3>Description:</h3>
                <pre id="SingleOverviewDesc" style="text-align: center; white-space: pre-line; height: fit-content;">
    Lorem ipsum dolor sit amet, 
    consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    
    Ut enim ad minim veniam, 
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
    Excepteur sint occaecat cupidatat non proident, 
    sunt in culpa qui officia deserunt mollit anim id est laborum.</pre>
            </div>
            <div class="${styles.descriptionitem}">
                <h3 id="SingleSubdivisionTitle">Chapters/components:</h3>
                <table id="SingleSubdivisionTable">
                    <tr>
                        <th>Chapter/component:</th>
                        <th>Date:</th>
                        <th>Link:</th>
                    </tr>
                </table>
            </div>
        </div>
        <div>
            <h3>Base statistics:</h3>
            <table>
                <tr>
                    <th>Statistic:</th>
                    <th>Value:</th>
                </tr>
                <tr>
                    <td>Author(s):</td>
                    <td id="SingleOwnerField">100</td>
                </tr>
                <tr>
                    <td>Views:</td>
                    <td id="SingleViewField">100</td>
                </tr>
                <tr>
                    <td>Feedbackers:</td>
                    <td id="SingleFeedbackersField">5</td>
                </tr>
                <tr>
                    <td>Likes:</td>
                    <td>NA</td>
                </tr>
                <tr>
                    <td>First version release date:</td>
                    <td id="SingleFirstVersionDateField">2 months ago</td>
                </tr>
                <tr>
                    <td>Newest version release date:</td>
                    <td id="SingleLastUpdateField">Today</td>
                </tr>
                <tr>
                    <td>Type:</td>
                    <td>Writing</td>
                </tr>
                <tr>
                    <td>Genre:</td>
                    <td id="SingleGenreField">Test document</td>
                </tr>
            </table>

            <h3>Content triggers:</h3>
            <ul>
                <li id="SingleTriggersField">Tigger1</li>
            </ul>
            <h3>Tags:</h3>
            <ul>
                <li id="SingleTagsField">Tag1</li>
            </ul>
        </div>

    </div>
    <button id="latestVersioneRedirectButton" onclick="
    
    ">Go to latest version &rarr;</button>
</div>
</div>`


    return html;
}


}