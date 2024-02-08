import {
  Component, Input, OnChanges, SimpleChanges,
} from '@angular/core';
import { ExternalOAuthProvidersEnum } from '@app/shared';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-btn-connect-google',
  standalone: true,
  imports: [],
  templateUrl: './btn-connect-google.component.html',
  styleUrls: ['./btn-connect-google.component.scss'],
})
export class BtnConnectGoogleComponent implements OnChanges {
  @Input() remember = false;

  authorizeUrl = this.authService.getAuthorizeUrl(ExternalOAuthProvidersEnum.GOOGLE, this.remember);

  constructor(private authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['remember']) {
      this.remember = changes['remember'].currentValue;

      this.authorizeUrl = this.authService
        .getAuthorizeUrl(ExternalOAuthProvidersEnum.GOOGLE, changes['remember'].currentValue);
    }
  }
}
