import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './FooterWebPart.module.scss';

export interface IFooterWebPartProps {
}

export default class FooterWebPart extends BaseClientSideWebPart<IFooterWebPartProps> {
  public render(): void {
    this.domElement.innerHTML = `
    <footer class="${styles.footer}">
    <p>
        Our social media:
          <a href="BehindTheScenes.html"><img style="height: 1%; width: 1%;" src="${require('../../shared/assets/facebook.png')}"></a>
          <a href="BehindTheScenes.html"><img style="height: 1%; width: 1%;" src="${require('../../shared/assets/twitter.png')}"></a>
          &nbsp&nbsp &copy 2023</p>
        </footer>
    `;
  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
