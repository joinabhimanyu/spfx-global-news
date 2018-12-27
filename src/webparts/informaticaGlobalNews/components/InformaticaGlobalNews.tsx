import * as React from 'react';
import styles from './InformaticaGlobalNews.module.scss';
import { IInformaticaGlobalNewsProps } from './IInformaticaGlobalNewsProps';
import { IInformaticaGlobalNewsState, IInformaticaGlobalNewsModel } from './IInformaticaGlobalNewsState';
import { escape } from '@microsoft/sp-lodash-subset';
import MockHttpClient from './MockHttpClient';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';
import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardTitle,
  IDocumentCardPreviewProps,
  DocumentCardType,
} from 'office-ui-fabric-react/lib/DocumentCard';
import { ImageFit } from 'office-ui-fabric-react/lib/Image';
import { CommandBarButton, ActionButton } from 'office-ui-fabric-react/lib/Button';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import * as strings from 'InformaticaGlobalNewsWebPartStrings';

export default class InformaticaGlobalNews extends React.Component<IInformaticaGlobalNewsProps, IInformaticaGlobalNewsState> {
  private _isMounted: boolean=false;
  constructor() {
    super();
    this.state = { items: [], addActionUrl: '', validProps: true };
  }
  public componentDidMount(): void {
    this._isMounted = true;
    if (this.validateProps() && this._isMounted) {
      this.setState({ validProps: true });
      this._renderListAsync();
    } else {
      if (this._isMounted) {
        this.setState({ validProps: false });
      }
    }
  }
  public componentWillUnmount(): void {
    this._isMounted = false;
  }
  private validateProps(): boolean {
    if (!this.props.WebPartTitle || !this.props.context ||
      !this.props.ListName || !this.props.SeeAllAction ||
      !this.props.TilesCount || this.props.TilesCount == 0 ||
      !this.props.AddTarget || !this.props.SeeAllTarget) {
      return false;
    } else return true;
  }
  private _renderListAsync(): void {
    if (Environment.type === EnvironmentType.Local) {
      this._getMockListData().then((response) => {
        const listid = '{' + this.props.ListName + '}';
        const addActionUrl = this.props.context.pageContext.web.absoluteUrl + '/_layouts/15/listform.aspx?PageType=8&ListId=' + listid;
        if (this._isMounted) {
          this.setState({ items: response, addActionUrl: addActionUrl });
        }
      });
    }
    else if (Environment.type == EnvironmentType.SharePoint ||
      Environment.type == EnvironmentType.ClassicSharePoint) {
      this._getListData()
        .then((response) => {
          const listid = '{' + this.props.ListName + '}';
          const addActionUrl = this.props.context.pageContext.web.absoluteUrl + '/_layouts/15/listform.aspx?PageType=8&ListId=' + listid;
          if (this._isMounted) {
            this.setState({ items: response, addActionUrl: addActionUrl });
          }
        });
    }
  }

  private _getMockListData(): Promise<IInformaticaGlobalNewsModel[]> {
    return MockHttpClient.get()
      .then((data: IInformaticaGlobalNewsModel[]) => {
        return data;
      }) as Promise<IInformaticaGlobalNewsModel[]>;
  }

  private _getListData(): Promise<IInformaticaGlobalNewsModel[]> {
    // get global news data with listname in url
    const url = `/_api/web/Lists('${this.props.ListName}')/Items?$select=ID,Label,Title,RedirectUrl,Target,ImageUrl,ContentOwner/Id,ContentOwner/Name,ContentOwner/Title,OrderBy,Modified,Created,Author/Id,Author/Name,Author/Title,Editor/Id,Editor/Name,Editor/Title,GUID&$expand=Author,Editor,ContentOwner&$OrderBy=OrderBy desc`;
    return this.props.context.spHttpClient.get(this.props.context.pageContext.web.absoluteUrl + url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      }).then((data) => {
        return data.value.map((item) => {
          return {
            Id: item.Id,
            Title: item.Title,
            Label: item.Label,
            Target: item.Target,
            RedirectUrl: item.RedirectUrl,
            ImageUrl: item.ImageUrl,
            OrderBy: item.OrderBy,
            Modified: item.Modified,
            Created: item.Created,
            GUID: item.GUID,

            ContentOwnerId: item.ContentOwner.Id,
            ContentOwnerName: item.ContentOwner.Title,
            AuthorId: item.Author.Id,
            AuthorName: item.Author.Title,
            EditorId: item.EditorId,
            EditorName: item.Editor.Title
          };
        });
      });
  }

  public render(): React.ReactElement<IInformaticaGlobalNewsProps> {

    let documentCard, documentCardHeader, addLinkButton;
    if (this.state.items && this.state.items.length > 0) {
      const previewProps: IDocumentCardPreviewProps = {
        getOverflowDocumentCountText: (overflowCount: number) => `+${overflowCount} more`,
        previewImages: [
        ]
      };
      for (const item of this.state.items) {
        previewProps.previewImages.push({
          name: item.Title,
          url: item.RedirectUrl,
          previewImageSrc: item.ImageUrl,
          iconSrc: '',
          imageFit: ImageFit.cover,
          height: 94,
          width: 126

        });
      }
      documentCard = <div>
        {this.state.items.slice(0, this.props.TilesCount).map((item, i) =>
          <DocumentCard className={styles.documentCard} key={i} type={DocumentCardType.compact} onClickHref={item.RedirectUrl}>
            <DocumentCardPreview previewImages={[previewProps.previewImages[i]]} />
            <div className="ms-DocumentCard-details">
              <DocumentCardTitle title={item.Label} shouldTruncate={true} />
              <DocumentCardActivity
                activity={`${strings.CreatedLabel} ${item.Created}`}
                people={[{ name: `${item.AuthorName}`, profileImageSrc: '' }]}
              />
            </div>
          </DocumentCard>
        )
        }
      </div>;

      addLinkButton = <div className={styles.addLinkButton}>
        <ActionButton className={styles.addLinkActionButton}
          data-automation-id="newsAddButton"
          data-interception="propagate"
          iconProps={{ iconName: 'Add' }}
          target={this.props.AddTarget}
          href={this.state.addActionUrl}>
          {strings.AddLabel}
        </ActionButton>
      </div>;

      documentCardHeader = <div className={styles.documentCardHeader}>
        {addLinkButton}
        <Link target={this.props.SeeAllTarget} href={this.props.SeeAllAction} title={strings.SeeAllLabel}>{strings.SeeAllLabel}</Link>
      </div>;
    }

    if (this.state.validProps) {
      return (
        <div className={styles.informaticaGlobalNews}>
          {documentCardHeader}
          {documentCard}
        </div>
      );
    } else {
      return (
        <MessageBar>
          {strings.MessageBoxLabel}
        </MessageBar>
      );
    }
  }
}
