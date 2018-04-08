// store the contents of a cell in a class
function Cell(row, col, data, text, note){
	this.row = row;
	this.col = col;
	this.data = data;
	this.text = text;
	this.note = note;
}

// generate the table of attendence data
function genTable(students, start, end){
	
	// helper arrays for date formatting (might be a good idea to use moment.js)
	const aMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	let month = [start];
	let day;

	// generates the date range
	while(start.getTime() < end.getTime()){
		day = new Date(start);
		day.setDate(start.getDate()+1);
		if(day.getDay() != 0 && day.getDay() != 6){
			month.push(day);
		}
		start = day;
	}

	let attendence = [];
	let header = [];
	header.push(new Cell(0, 0, "", "Student Name:", ""));
	for(let i=0; i<month.length; i++){
		let day = month[i];
		// header.push(
		// 	new Cell(
		// 		0, 
		// 		i+1, 
		// 		"", 
		// 		`<abbr title="${days[day.getDay()]} ${months[day.getMonth()]} ${day.getDate()}, ${day.getFullYear()}">${aMonths[day.getMonth()]} ${day.getDate()}</abbr>`, 
		// 		""
		// 	)
		// );
		header.push(
			new Cell(
				0, 
				i+1, 
				"", 
				`${aMonths[day.getMonth()]} ${day.getDate()}</abbr>`, 
				""
			)
		);
	}
	attendence.push(header);

	for(let i=0; i<students.length; i++){
		let row = [];
		row.push(new Cell(i+1, 0, "", students[i], ""));
		for(let j=0; j<month.length; j++){
			row.push(new Cell(i+1, j+1, "", "", ""));
		}
		attendence.push(row);
	}

	return attendence;
}

// draw the table onto the selected element
function drawTable(id, attendence){
	let t = '<div id="table">'
	for(let i=0; i<attendence.length; i++){
		t += `<div class="row">`;
		for(let j=0; j<attendence[i].length; j++){
			t += `<div class="cell" data-row="${attendence[i][j].row}" data-col="${attendence[i][j].col}">${attendence[i][j].text}</div>`;
		}
		t += `</div>`;
	}
	t += '</div>';
	document.getElementById(id).innerHTML = t; 
}

let attendence = genTable(
	["Lark", "Mark", "John", "Zoya", "Sergio", "Paul", "Thomas", "Hilton", "Shelia", "Patrick", "James", "Eirika", "Yevgeniy", "Yonis", "Temmuujin"],
	new Date('2018-03-05T00:00:00'),
	new Date('2018-03-30T00:00:00')
);

// console.log(attendence);
drawTable("sheet", attendence);

var selectedCell = [1,1];

const cells = document.getElementsByClassName("cell");
for(let cell of cells){
	// left click event
	cell.addEventListener("click", function(e){
		let el = e.target;
		if(el.dataset.row != 0 && el.dataset.col != 0 && el.nodeName != "ABBR"){
			if(!ctrl){
				for(let cell of cells){
					cell.classList.remove("selected");
				}
			}
			el.classList.add("selected");
			selectedCell = [parseInt(e.target.dataset.row), parseInt(e.target.dataset.col)];
		}
		if(el.dataset.col == 0 && el.dataset.row != 0){
			if(!ctrl){
				for(let cell of cells){
					cell.classList.remove("selected");
				}
			}
			for(let i=1; i<=attendence[0].length-1; i++){
				let temp = document.querySelector(`[data-row="${el.dataset.row}"][data-col="${i}"]`);
				temp.classList.add("selected");
			}
		}else if(el.dataset.row == 0 && el.dataset.col != 0){
			if(!ctrl){
				for(let cell of cells){
					cell.classList.remove("selected");
				}
			}
			for(let i=1; i<=attendence.length-1; i++){
				let temp = document.querySelector(`[data-row="${i}"][data-col="${el.dataset.col}"]`);
				temp.classList.add("selected");
			}
		}
	});
	// right click event
	cell.addEventListener('contextmenu', function(e){
		console.log(e);
		e.preventDefault();
		for(let cell of cells){
			cell.classList.remove("selected");
		}
		e.target.classList.add("selected");
		selectedCell = [parseInt(e.target.dataset.row), parseInt(e.target.dataset.col)];
		console.log("right click");
	});
	// double click event
	cell.addEventListener('dblclick', function(e){
		if(e.target.dataset.row != 0 && e.target.dataset.col != 0){
			e.preventDefault();
			for(let cell of cells){
				cell.classList.remove("selected");
			}
			e.target.classList.add("selected");
			selectedCell = [parseInt(e.target.dataset.row), parseInt(e.target.dataset.col)];
			console.log("double click");
		}
	});
}

function addStyle(){
	selected = document.querySelector(`[data-row="${selectedCell[0]}"][data-col="${selectedCell[1]}"]`);
	for(let cell of cells){
		cell.classList.remove("selected");
	}
	selected.classList.add("selected");
}
addStyle();

// navigate the spreadsheet using arrow keys
document.onkeydown = function(e){
	selected = document.querySelector(`[data-row="${selectedCell[0]}"][data-col="${selectedCell[1]}"]`);
	// up
	if(e.keyCode == 38){
		selectedCell[0] > 1 ? selectedCell[0] -= 1 : selectedCell[0];
		addStyle();
	}
	// down
	if(e.keyCode == 40){
		selectedCell[0] < attendence.length-1 ? selectedCell[0] += 1 : selectedCell[0];
		addStyle();
	}
	// left
	if(e.keyCode == 37){
		selectedCell[1] > 1 ? selectedCell[1] -= 1 : selectedCell[1];
		addStyle();
	}
	// right
	if(e.keyCode == 39){
		selectedCell[1] < attendence[0].length-1 ? selectedCell[1] += 1 : selectedCell[1];
		addStyle();
	}
	// backspace
	if(e.keyCode == 8){
		selected = document.getElementsByClassName("selected");
		for(let cell of selected){
			cell.innerHTML = "";
		}
	}
	// ctrl
	if(e.keyCode == 17){
		ctrl = true;
	}
}

document.onkeyup = function(e){
	if(e.keyCode == 17){
		ctrl = false;
	}
}

// put text into cells (excluding some keys)
document.onkeypress = function(e){
	let valid = true;
	// keycodes to exclude
	for(let code of [8,9,13,27,37,38,39,40,46]){
		if(code === e.keyCode){
			valid = false;
		}
	}
	if(valid){
		selected = document.getElementsByClassName("selected");
		for(let cell of selected){
			cell.innerHTML += e.key;
		}
	}
}

let mouse = {pressed: false, x0: null, y0: null, row0: null, col0: null};
let selectedCells = [];
let ctrl = false;

document.addEventListener("mousedown", function(e){
	mouse.pressed = true;
	mouse.x0 = e.clientX;
	mouse.y0 = e.clientY;
	let element = document.elementFromPoint(e.clientX, e.clientY);
	if(element.dataset.row){
		mouse.row0 = element.dataset.row;
		mouse.col0 = element.dataset.col;
	}
});

document.addEventListener("mouseup", function(e){
	mouse.pressed = false;
	mouse.x0 = null;
	mouse.y0 = null;
	mouse.row0 = null;
	mouse.col0 = null;
});

document.addEventListener("mousemove", function(e){
	if(mouse.pressed){
		let element = document.elementFromPoint(e.clientX, e.clientY);
		if(element.dataset.row){
			if(element.dataset.row > 0 && element.dataset.col > 0){
				let top = parseInt(mouse.row0) < parseInt(element.dataset.row) ? parseInt(mouse.row0) : parseInt(element.dataset.row);
				let bottom = parseInt(mouse.row0) > parseInt(element.dataset.row) ? parseInt(mouse.row0) : parseInt(element.dataset.row);
				let left = parseInt(mouse.col0) < parseInt(element.dataset.col) ? parseInt(mouse.col0): parseInt(element.dataset.col);
				let right = parseInt(mouse.col0) > parseInt(element.dataset.col) ? parseInt(mouse.col0): parseInt(element.dataset.col);
				if(!ctrl){
					for(let cell of cells){
						cell.classList.remove("selected");
					}
				}
				for(let i=top; i<=bottom; i++){
					for(let j=left; j<=right; j++){
						let temp = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
						temp.classList.add("selected");
					}
				}
				selectedCell = [parseInt(element.dataset.row), parseInt(element.dataset.col)];
			}
		}
	}
});