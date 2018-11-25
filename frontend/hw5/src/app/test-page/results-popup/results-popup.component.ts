import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as chart from 'chart.js';

@Component({
	selector: 'app-results-popup',
	templateUrl: './results-popup.component.html',
	styleUrls: ['./results-popup.component.css']
})
export class ResultsPopupComponent implements OnInit {
	public data;

	private freqChart: chart.Chart;
	private progressChart: chart.Chart;
	public dialogdata : any;

	constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
    	this.dialogdata = data;
    }

	ngOnInit() {
		this.loaded = true;

		setTimeout(() => {
			let ctx = document.getElementById('freqCanvas');
			ctx.setAttribute('style', 'height:100px');
			this.freqChart = new chart.Chart(ctx, {
				type: 'line',
	  			data: {
	  				labels: [0, 1, 2, 3, 4, 5, 6],
	  				datasets: [
	  				{
		                label: "Tremors",
		                data: [0.5, 0.7, 0.3, this.dialogdata['value'], 0.4, 0.5, 0.2],
		                borderColor: '#DC143C',
		                fill: false,
		            }]
	  			},
	  			options: {
	  				title: {
	  					display: true,
	  					text: 'Amplitude vs. Frequency'
	  				},
	  				scales: {
	  					yAxes: [{
	  						ticks: {
	  							min: 0,
	  							max: Math.round(this.dialogdata['value'] + 2),
	  							stepSize: 1
	  						}
	  					}]
	  				}
	  			}
			});
			(<any>window).freqLine = this.freqChart;
		}, 1000);

		setTimeout(() => {
			let ctx = document.getElementById('progressCanvas');
			ctx.setAttribute('style', 'height:100px');
			this.progressChart = new chart.Chart(ctx, {
				type: 'line',
	  			data: {
	  				labels: [0, 1, 2, 3, 4, 5],
	  				datasets: [
	  				{
		                label: "Progress",
		                data: [0, 3, 2, 7, 6, 9],
		                borderColor: '#DC143C',
		                fill: false,
		            }]
	  			},
	  			options: {
	  				title: {
	  					display: true,
	  					text: 'Cem'
	  				},
	  				scales: {
	  					yAxes: [{
	  						ticks: {
	  							min: 0,
	  							max: 10,
	  							stepSize: 1
	  						}
	  					}]
	  				}
	  			}
			});
			(<any>window).progressLine = this.progressChart;
		}, 1000);
	}
}
