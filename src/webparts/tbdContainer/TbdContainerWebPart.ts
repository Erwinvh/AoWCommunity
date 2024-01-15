import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './TbdContainerWebPart.module.scss';
import * as strings from 'TbdContainerWebPartStrings';

export interface ITbdContainerWebPartProps {
  description: string;
  title: string;
}

export default class TbdContainerWebPart extends BaseClientSideWebPart<ITbdContainerWebPartProps> {
  public render(): void {
    this.domElement.innerHTML = `<div class="${styles.maincontainer}">

  <h1 style="text-align: center;">  ${escape(this.properties.title)}</h1>

  <pre style="text-align: center;">
  ${escape(this.properties.description)}
  </pre>

</div>`;
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



}
