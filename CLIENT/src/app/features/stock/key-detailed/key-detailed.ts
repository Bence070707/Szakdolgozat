import { Component, inject, OnInit, signal } from '@angular/core';
import { KeysService } from '../../../core/services/keys-service';
import { Key } from '../../../../types/Key';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-key-detailed',
  imports: [],
  templateUrl: './key-detailed.html',
  styleUrl: './key-detailed.css',
})
export class KeyDetailed implements OnInit {
  private keysService = inject(KeysService);
  protected currentKey = signal<Key | null>(null);
  private route = inject(ActivatedRoute);


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.keysService.getKeyById(id).subscribe({
      next: (key) => {
        this.currentKey.set(key);
      },
      error: (err) => {
        console.error('Error fetching key:', err);
      }
    })
  }

}
