import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './TopBarWebPart.module.scss';

export interface ITopBarWebPartProps {
}

export default class TopBarWebPart extends BaseClientSideWebPart<ITopBarWebPartProps> {
  public render(): void {
    this.domElement.innerHTML = `<div class="${ styles.topBar }">
    <div class="${styles.banner}">
    <a href="Home.html">
      <img draggable="false" src="${require('../../shared/assets/banner1.png')}" alt="AoW community banner">
    </a>
  </div>

  <div class="${styles.HomeButton}">
    <a href="Home.html" class="${styles.roundbutton}">
      <img draggable="false" src="${require('../../shared/assets/Homebutton.png')}" alt="AoW community logo" >
    </a>
</div>


    <div class="${styles.mainnavbar}">
    <li><a class="" href="Who are we.html">Who are we?</a></li>
    <li><a class="" href="code of conduct.html">Code of conduct</a></li>
    <li><a class="" href="mission.html">Our mission</a></li>
    <li><a class="" href="contact.html">Contact</a></li>
    <li><a class="" href="login signup.html">Log in/sign up</a></li>
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
