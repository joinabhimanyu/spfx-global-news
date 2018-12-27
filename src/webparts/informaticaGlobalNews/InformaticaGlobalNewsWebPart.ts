import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import { Dialog } from '@microsoft/sp-dialog';
import MockHttpClient from './components/MockHttpClient';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';

import * as strings from 'InformaticaGlobalNewsWebPartStrings';
import InformaticaGlobalNews from './components/InformaticaGlobalNews';
import { IInformaticaGlobalNewsProps } from './components/IInformaticaGlobalNewsProps';

export interface IInformaticaGlobalNewsWebPartProps {
  WebPartTitle:string;
  ListName: string;
  SeeAllAction: string;
  TilesCount: number;
  AddTarget: string;
  SeeAllTarget: string;
}

export default class InformaticaGlobalNewsWebPart extends BaseClientSideWebPart<IInformaticaGlobalNewsWebPartProps> {

  // options for listname dropdown
  private listNames: IPropertyPaneDropdownOption[];
  private listsDropdownDisabled: boolean = true;
  /**
   * populate listname dropdown
   */
  private loadListNames(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (Environment.type === EnvironmentType.Local) {
        this._getMockListNameData().then((response) => {
          resolve(response);
        });
      }
      else if (Environment.type == EnvironmentType.SharePoint ||
        Environment.type == EnvironmentType.ClassicSharePoint) {
        this._getListNameData()
          .then((response) => {
            resolve(response);
          });
      }
    });
  }

  /**
   * get fake data for listname dropdown
   */
  private _getMockListNameData(): Promise<any> {
    return MockHttpClient.getlistnames()
      .then((data: any) => {
        return data;
      }) as Promise<any>;
  }
  /**
   * get data for listname dropdown
   */
  private _getListNameData(): Promise<any> {

    //get data for list name options
    //
    return this.context.spHttpClient.get(
      this.context.pageContext.web.absoluteUrl +
      `/_api/web/Lists?$select=Id,Title&$filter=Hidden eq false and BaseTemplate eq 100&$Orderby=Title desc`,
      SPHttpClient.configurations.v1
    )
      .then((response: SPHttpClientResponse) => {
        return response.json();
      }).then((data) => {
        return data.value.map((item) => {
          return {
            key: item.Id || 0,
            text: item.Title || ''
          };
        });
      }).catch((err) => {
        Dialog.alert('Error occurred while fetchingdata');
      });
  }

  public render(): void {
    const element: React.ReactElement<IInformaticaGlobalNewsProps> = React.createElement(
      InformaticaGlobalNews,
      {
        WebPartTitle:this.properties.WebPartTitle,
        context: this.context,
        ListName: this.properties.ListName,
        SeeAllAction: this.properties.SeeAllAction,
        TilesCount: this.properties.TilesCount,
        AddTarget: this.properties.AddTarget,
        SeeAllTarget: this.properties.SeeAllTarget
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  /**
   * get property pane configuration settings
   */
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('WebPartTitle', {
                  label: strings.WebPartTitleFieldLabel
                }),
                PropertyPaneDropdown('ListName', {
                  label: strings.ListNameFieldLabel,
                  options: this.listNames,
                  disabled: this.listsDropdownDisabled
                }),
                PropertyPaneTextField('SeeAllAction', {
                  label: strings.SeeAllActionFieldLabel
                }),
                PropertyPaneDropdown('AddTarget', {
                  label: strings.AddTargetFieldLabel,
                  options: [{
                    key: '_blank',
                    text: '_blank'
                  }, {
                    key: '_self',
                    text: '_self'
                  }],
                }),
                PropertyPaneDropdown('SeeAllTarget', {
                  label: strings.SeeAllTargetFieldLabel,
                  options: [{
                    key: '_blank',
                    text: '_blank'
                  }, {
                    key: '_self',
                    text: '_self'
                  }],
                }),
                PropertyPaneTextField('TilesCount', {
                  label: strings.TilesCountFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
  /**
   * on property pane configuration start event
   */
  protected onPropertyPaneConfigurationStart(): void {
    this.listsDropdownDisabled = !this.listNames;
    if (this.listNames) {
      return;
    }
    this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'listNames');

    this.loadListNames()
      .then((listOptions: IPropertyPaneDropdownOption[]): void => {
        this.listNames = listOptions;
        this.listsDropdownDisabled = false;
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        this.context.propertyPane.refresh();
        this.onDispose();
        this.render();
      });
  }

  /**
   * on property field changed event handler
   * @param propertyPath
   * @param oldValue
   * @param newValue
   */
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath == 'TilesCount') {
      if (newValue) {
        this.properties.TilesCount = parseInt(newValue);
      } else this.properties.TilesCount = 0;
    }
    this.context.statusRenderer.clearLoadingIndicator(this.domElement);
    this.context.propertyPane.refresh();
    this.onDispose();
    this.render();
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }
}
