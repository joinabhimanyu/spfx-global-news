import { IInformaticaGlobalNewsModel } from './IInformaticaGlobalNewsState';

export default class MockHttpClient {

  private static _items: IInformaticaGlobalNewsModel[] = [{
    Label: 'Google Cloud and Informatica Combine API Management and iPaaS to Accelerate Digital Transformation Published by Prasanta Das on 5 days ago. Description: Informatica is partnering with Google Cloud’s Apigee product group to provide enterprises with a unifi',
    Title: 'Google Cloud and Informatica Combine API Management and iPaaS to Accelerate Digita…',
    RedirectUrl: 'https://informaticadev.sharepoint.com/sites/Life/SitePages/Google-Cloud-and-Informatica-Combine-API-Management-and-iPaaS-to-Accelerate-Digital-Transformation.aspx',
    Target: '_self',
    ImageUrl: 'https://informaticadev.sharepoint.com/_layouts/15/getpreview.ashx?guidSite=72053074-8699-4fcf-a139-71f89402ab62&guidWeb=eb3cdda2-3646-453b-a440-6065293393ec&guidFile=d4790980-56a3-475f-a256-b7ecf62e23dd&resolution=2',
    ContentOwnerId: 10,
    ContentOwnerName: 'Saikat Ojha',
    Id: 3,
    OrderBy: 0,
    Modified: new Date().toLocaleDateString(),
    Created: new Date().toLocaleDateString(),
    AuthorId: 10,
    AuthorName: 'Saikat Ojha',
    EditorId: 10,
    EditorName: 'Saikat Ojha',
    GUID: 'bc6a09b1-3f29-4b18-a9f9-881bb58e416f'
  }, {
    Label: 'Google’s Apigee teams up with Informatica to extend its API ecosystem Published by Prasanta Das on 5 days ago. Description: Google acquired API management service Apigee back in 2016, but it’s been pretty quiet around the service in recent years. Today, h',
    Title: 'Google’s Apigee teams up with Informatica to extend its API ecosystem',
    RedirectUrl: 'https://informaticadev.sharepoint.com/sites/Life/SitePages/Google’s-Apigee-teams-up-with-Informatica-to-extend-its-API-ecosystem.aspx',
    Target: '_self',
    ImageUrl: 'https://informaticadev.sharepoint.com/_layouts/15/getpreview.ashx?guidSite=72053074-8699-4fcf-a139-71f89402ab62&guidWeb=eb3cdda2-3646-453b-a440-6065293393ec&guidFile=a8e15bb5-682f-4392-9d5a-c72691be33d4&resolution=2',
    ContentOwnerId: 10,
    ContentOwnerName: 'Saikat Ojha',
    Id: 2,
    OrderBy: 1,
    Modified: new Date().toLocaleDateString(),
    Created: new Date().toLocaleDateString(),
    AuthorId: 10,
    AuthorName: 'Saikat Ojha',
    EditorId: 10,
    EditorName: 'Saikat Ojha',
    GUID: 'bc6a09b1-3f29-4b18-a9f9-881bb58e416f'
  }, {
    Label: 'Effective artificial intelligence requires a healthy diet of data Published by Prasanta Das on 5 days ago. Description: In the current technology landscape, nothing elicits quite as much curiosity and excitement as artificial intelligence (AI). And we are',
    Title: 'Effective artificial intelligence requires a healthy diet of data',
    RedirectUrl: 'https://informaticadev.sharepoint.com/sites/Life/SitePages/Effective-artificial-intelligence-requires-a-healthy-diet-of-data.aspx',
    Target: '_self',
    ImageUrl: 'https://informaticadev.sharepoint.com/_layouts/15/getpreview.ashx?guidSite=72053074-8699-4fcf-a139-71f89402ab62&guidWeb=eb3cdda2-3646-453b-a440-6065293393ec&guidFile=e3045711-bcd1-4a3c-804e-425cde652a07&resolution=2',
    ContentOwnerId: 10,
    ContentOwnerName: 'Saikat Ojha',
    Id: 1,
    OrderBy: 0,
    Modified: new Date().toLocaleDateString(),
    Created: new Date().toLocaleDateString(),
    AuthorId: 10,
    AuthorName: 'Saikat Ojha',
    EditorId: 10,
    EditorName: 'Saikat Ojha',
    GUID: 'bc6a09b1-3f29-4b18-a9f9-881bb58e416f'
  }];

  private static listnames: Array<any> = [
    {
      key: 'c914d2a0-1927-406d-93b5-2b6a537cca2c',
      text: 'ServiceNowKB'
    },
    {
      key: 'a7f98627-2bd3-4a62-b04a-b4f0ad3ab44a',
      text: 'GlobalNews'
    },
    {
      key: '54b5870a-7fb2-4c2a-9b9e-4f8330450076',
      text: 'contacts'
    }
  ];

  public static get(): Promise<IInformaticaGlobalNewsModel[]> {
    return new Promise<IInformaticaGlobalNewsModel[]>((resolve) => {
      resolve(MockHttpClient._items);
    });
  }
  public static getlistnames(): Promise<Array<any>> {
    return new Promise<Array<any>>((resolve) => {
      resolve(MockHttpClient.listnames);
    });
  }
}
