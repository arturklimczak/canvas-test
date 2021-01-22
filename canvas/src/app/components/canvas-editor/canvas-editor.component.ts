import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-canvas-editor',
  templateUrl: './canvas-editor.component.html',
  styleUrls: ['./canvas-editor.component.scss']
})
export class CanvasEditorComponent implements OnInit {
  canvas: any;
  initSVG: any;
  imagesList: any[] = [];
  @ViewChild('file') file: ElementRef | undefined;

  constructor() { }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas');

    const priceText = new fabric.IText('2', {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: 200,
      top: 20,
      left: 10,
      fill: 'red'
    });

    const priceText2 = new fabric.IText('99', {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: 110,
      top: 30,
      left: 130,
      fill: 'red'
    });

    const priceText3 = new fabric.IText('2', {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: 50,
      top: 140,
      left: 140,
      fill: '#c3bfbf'
    });

    const priceText4 = new fabric.IText('99', {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: 20,
      top: 145,
      left: 170,
      fill: '#c3bfbf'
    });

    const text1 = new fabric.IText('Żywiec Saison', {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: 70,
      top: 450,
      left: 10
    });

    const text2 = new fabric.IText('piwo butelkowe 0,5l', {
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fill: '#c3bfbf',
      fontSize: 35,
      top: 520,
      left: 10
    });

    this.canvas.add(priceText, priceText2, priceText3, priceText4, text1, text2);
    text1.bringToFront();

    this.initSVG = this.canvas.toSVG();
    console.log(this.initSVG);
  }

  exportSVG(): void {
    const svg = this.canvas.toSVG();
    console.log(svg);
    console.log('takie samo jak init?: ', svg === this.initSVG);
  }

  selectImage(): void {
    // console.log(this.file);
    // console.log(this.file?.nativeElement);
    this.file?.nativeElement.click();
  }

  uploadImage(event: any): void {
    Array.prototype.forEach.call(event?.target?.files, (file) => {
      // console.log(file);

      const imageReader = new FileReader();
      imageReader.readAsDataURL(file);
      imageReader.onload = () => {
        if (typeof imageReader.result === 'string') {
          fabric.Image.fromURL(imageReader.result, (img) => {
            const widthToScale = 600 / (img.width || 600);
            const heightToScale = 400 / (img.height || 400);
            let scale = Math.min(widthToScale, heightToScale);
            if (scale > 1) {
              scale = 1;
            }

            img.set('left', 0);
            img.set('top', 0);
            img.scale(scale);
            this.canvas.add(img);

            this.imagesList.push({
              name: file.name,
              base64: imageReader.result,
              element: img
            });
          });
        }

        // console.log(imageReader.result);
      };
    });
  }
}
