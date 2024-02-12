import styles from './shared.module.scss';

export default class HTMLRenderer{

    //Render method to construct the left navigation menu used by logged in members
    // - Parameter: A string with the a select range of values. 
    //              The value deremines the active page the screen is on.
    // - Returns:   A string containing the HTML code for the left navigation menu
    // - Example:   This method is called on a new webpart for the new page: My feedback, the call for this function would be: renderMemberBar("MyFeedback");
    public renderMemberBar(activeTab: string):string{
        let html: string = `
        <div>
        <ul class="${styles.memberBar}">`
        if(activeTab === "Explore"){
            html+=`<li><a class="${styles.active}"><img draggable="false" src="${require('./assets/explore.png')}" alt="Explore writing function"><br>Writers in town</a></li>`
        }else{
            html+=`<li><a><img draggable="false" src="${require('./assets/explore.png')}" alt="Explore writing function"><br>Writers in town</a></li>`
        }
        if(activeTab === "MyWritings"){
            html+=`<li><a class="${styles.active}"><img draggable="false" src="${require('./assets/writing.png')}" alt="Owned writing overview"><br>My writing</a></li>`
        }else{
            html+=`<li><a><img draggable="false" src="${require('./assets/writing.png')}" alt="Owned writing overview"><br>My writing</a></li>`
        }
        if(activeTab === "MyFeedback"){
            html+=`<li><a class="${styles.active}"><img draggable="false" src="${require('./assets/chat.png')}" alt="Chat overview"><br>My chats (TBD)</a></li>`
        }else{
            html+=`<li><a><img draggable="false" src="${require('./assets/chat.png')}" alt="Chat overview"><br>My chats (TBD)</a></li>`
        }
        if(activeTab === "Following"){
            html+=`<li><a class="${styles.active}"><img draggable="false" src="${require('./assets/following.png')}" alt="Follwoed writers overview"><br>Followed writers (TBD)</a></li>`
        }else{
            html+=`<li><a><img draggable="false" src="${require('./assets/following.png')}" alt="Follwoed writers overview"><br>Followed writers (TBD)</a></li>`
        }
        if(activeTab === "Notifications"){
            html+=`<li><a class="${styles.active}"><img draggable="false" src="${require('./assets/notification.png')}" alt="nitifications overview"><br>Notifications (TBD)</a></li>`
        }else{
            html+=`<li><a><img draggable="false" src="${require('./assets/notification.png')}" alt="nitifications overview"><br>Notifications (TBD)</a></li>`
        }
        if(activeTab === "Groups"){
            html+=`<li><a class="${styles.active}"><img draggable="false" src="${require('./assets/team.png')}" alt="Joined teams overview"><br>Groups (TBD)</a></li>`
        }else{
            html+=`<li><a><img draggable="false" src="${require('./assets/team.png')}" alt="Joined teams overview"><br>Groups (TBD)</a></li>`
        }
        if(activeTab === "Material"){
            html+=`<li><a class="${styles.active}"><img draggable="false" src="${require('./assets/material.png')}" alt="Writing materials overview"><br>Source material (TBD)</a></li>`
        }else{
            html+=`<li><a><img draggable="false" src="${require('./assets/material.png')}" alt="Writing materials overview"><br>Source material (TBD)</a></li>`
        }
        if(activeTab === "Forum"){
            html+=`<li><a class="${styles.active}"><img draggable="false" src="${require('./assets/forum.png')}" alt="Forum"><br>Forum (TBD)</a></li>`
        }else{
            html+=`<li><a><img draggable="false" src="${require('./assets/forum.png')}" alt="Forum"><br>Forum (TBD)</a></li>`
        }
        html+=`</ul>
        </div>
        `;
        return html;
      }
}