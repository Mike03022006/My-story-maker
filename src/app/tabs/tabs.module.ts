import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';

// 👇 IMPORTAS el módulo de componentes (NO el componente directo)
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TabsPageRoutingModule,
    ComponentsModule 
  ],
  declarations: [
    TabsPage 
  ]
})
export class TabsPageModule {}