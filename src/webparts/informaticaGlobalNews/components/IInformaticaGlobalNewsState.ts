export interface IInformaticaGlobalNewsState {
  items: IInformaticaGlobalNewsModel[];
  addActionUrl:string;
  validProps:boolean;
}

export interface IInformaticaGlobalNewsModel {
  Label: string;
  Title: string;
  RedirectUrl: string;
  Target: string;
  ImageUrl: string;
  ContentOwnerId: number;
  ContentOwnerName:string;
  Id:number;
  OrderBy:number;
  Modified: string;
  Created: string;
  AuthorId:number;
  AuthorName:string;
  EditorId:number;
  EditorName:string;
  GUID:string;
}
