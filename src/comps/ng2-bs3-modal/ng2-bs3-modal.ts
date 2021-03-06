import { Type } from '@angular/core';

import { ModalComponent } from './components/modal';
import { ModalHeaderComponent } from './components/modal-header';
import { ModalBodyComponent } from './components/modal-body';
import { ModalFooterComponent } from './components/modal-footer';

export * from './components/modal';
export * from './components/modal-header';
export * from './components/modal-body';
export * from './components/modal-footer';

export const MODAL_DIRECTIVES: any = [
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent
];