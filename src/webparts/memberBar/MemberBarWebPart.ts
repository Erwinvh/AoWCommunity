import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './MemberBarWebPart.module.scss';

export interface IMemberBarWebPartProps {
}

export default class MemberBarWebPart extends BaseClientSideWebPart<IMemberBarWebPartProps> {
  public render(): void {
    this.domElement.innerHTML = `<div>
    
    <ul class="${styles.memberBar}">
    <li><a href="explore.html"><img draggable="false" src="${require('../../shared/assets/explore.png')}" alt="Explore writing function"><br>Writers in town</a></li>
    <li><a href="mywriting.html"><img draggable="false" src="${require('../../shared/assets/writing.png')}" alt="Owned writing overview"><br>My writing</a></li>
    <li><a href="myfeedback.html"><img draggable="false" src="${require('../../shared/assets/chat.png')}" alt="Chat overview"><br>My chats</a></li>
    <li><a href="following.html"><img draggable="false" src="${require('../../shared/assets/following.png')}" alt="Follwoed writers overview"><br>Followed writers</a></li>
    <li><a href="mynotifications.html"><img draggable="false" src="${require('../../shared/assets/notification.png')}" alt="nitifications overview"><br>Notifications</a></li>
    <li><a href="myteams.html"><img draggable="false" src="${require('../../shared/assets/team.png')}" alt="Joined teams overview"><br>Teams</a></li>
    <li><a href="material.html"><img draggable="false" src="${require('../../shared/assets/material.png')}" alt="Writing materials overview"><br>Writing material</a></li>
    <li><a href="forums.html"><img draggable="false" src="${require('../../shared/assets/forum.png')}" alt="Forum"><br>Forum</a></li>

  </ul>
    
    </div>`;
  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
