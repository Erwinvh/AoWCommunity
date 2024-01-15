import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './TopBarMembersWebPart.module.scss';

export interface ITopBarMembersWebPartProps {
}

export default class TopBarMembersWebPart extends BaseClientSideWebPart<ITopBarMembersWebPartProps> {
  public render(): void {
    this.domElement.innerHTML =   this.domElement.innerHTML = `<div class="${ styles.topBar }">
    <div class="${styles.banner}">
      <img draggable="false" src="${require('../../shared/assets/banner1.png')}" alt="AoW community banner">
  </div>

  <div class="${styles.HomeButton} ${styles.roundbutton}">
      <img draggable="false" src="${require('../../shared/assets/Homebutton.png')}" alt="AoW community logo" >
</div>


    <div class="${styles.mainnavbar}">
    <li><a class="" href="who are we.html">Who are we?</a></li>
    <li><a class="" href="Coc.html">Code of conduct</a></li>
    <li><a class="" href="mission.html">Our mission</a></li>
    <li><a class="active" href="contact.html">Contact</a></li>
    <li><a class="" href="account.html">Account</a></li>
    <li><a class="" href="../visitor/Home.html">Sign out</a></li>
  </div>
  </div>`;
  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
