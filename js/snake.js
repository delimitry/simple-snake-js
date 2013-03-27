//-----------------------------------------------------------------------
// Snake game
//
// Author: delimitry
//-----------------------------------------------------------------------

function Point(x, y) {
  this.x = x;
	this.y = y;

	this.collideWith = function(x, y) {
		return this.x == x && this.y == y;
	}
}

var SnakeDirections = {
	UP : 0,	
	DOWN : 1,
	LEFT : 2,
	RIGHT : 3
}

function getRandomRange(min, max) {
	return Math.random() * (max - min + 1) + min;
}

function Snake(canvas, context, point_size) {

	this.score = 0;
	this.game_over = false;
	this.game_win = false;
	this.game_paused = false;
	this.direction = SnakeDirections.RIGHT;
	this.point_size = point_size;
	this.body = new Array();
	this.eat = new Point();

	this.init = function() {		
		this.score = 0;
		this.game_over = false;
		this.game_win = false;
		this.game_paused = false;
		this.direction = SnakeDirections.RIGHT;
		this.body = new Array();

		pos_x = Math.floor(getRandomRange(0, canvas.width / 2) / this.point_size) * this.point_size;
		pos_y = Math.floor(getRandomRange(0, canvas.height) / this.point_size) * this.point_size;
		// init snake body
		for (var i = 0; i < 3; i++) {
			this.body.push(new Point(pos_x, pos_y));
		};
		
		eat_x = Math.floor(getRandomRange(0, canvas.width - this.point_size) / this.point_size) * this.point_size;
		eat_y = Math.floor(getRandomRange(0, canvas.height - this.point_size) / this.point_size) * this.point_size;
		this.eat = new Point(eat_x, eat_y);
	}


	this.draw = function() {
		for (var i = this.body.length-1; i >= 0; i--) {			
			if (i == 0) context.fillStyle = 'rgb(0,255,0)'; else context.fillStyle = 'rgb(255,0,0)';
			context.fillRect(this.body[i].x, this.body[i].y, this.point_size, this.point_size);	
		};

		context.fillStyle = 'rgb(255,0,255)';
		context.fillRect(this.eat.x, this.eat.y, this.point_size, this.point_size);	

		if (this.game_over) {
			context.fillStyle = 'rgb(255,255,0)';
			context.font = 'bold 20px Arial';
			context.fillText('Game Over', canvas.width / 2 - 50, canvas.height / 2);
		}

		if (this.game_win) {
			context.fillStyle = 'rgb(255,255,0)';
			context.font = 'bold 20px Arial';
			context.fillText('You Win', canvas.width / 2 - 30, canvas.height / 2);
		}

		if (this.game_paused) {
			context.fillStyle = 'rgb(255,255,0)';
			context.font = 'bold 20px Arial';
			context.fillText('Pause', canvas.width / 2 - 30, canvas.height / 2);
		}

		context.fillStyle = 'rgb(255,255,0)';
		context.font = 'bold 15px Arial';
		context.fillText('Score: '+ this.score, 5, 15);
	}


	this.toggle_pause = function() {
		this.game_paused = !this.game_paused;
	}


	this.update_direction = function(direction) {
		if (this.direction == SnakeDirections.LEFT && direction == SnakeDirections.RIGHT) return;
		if (this.direction == SnakeDirections.RIGHT && direction == SnakeDirections.LEFT) return;
		if (this.direction == SnakeDirections.UP && direction == SnakeDirections.DOWN) return;
		if (this.direction == SnakeDirections.DOWN && direction == SnakeDirections.UP) return;
		this.direction = direction;
	}


	this.update = function() {	
		if (this.game_over || this.game_win || this.game_paused) return;		
		step = 10;
		switch (this.direction) {
			case SnakeDirections.LEFT:				
				if (this.body[0].x > 0) {
					this.body.unshift(new Point(this.body[0].x - step, this.body[0].y));		
					this.body.pop();
				} else { 
					this.body[0].x = 0;
					this.game_over = true;
				}
				break;
			
			case SnakeDirections.UP:				
				if (this.body[0].y > 0) { 					
					this.body.unshift(new Point(this.body[0].x, this.body[0].y - step));		
					this.body.pop();
				} else { 
					this.body[0].y = 0; 
					this.game_over = true;
				}
				break;

			case SnakeDirections.RIGHT:
				if (this.body[0].x < canvas.width - this.point_size) {
					this.body.unshift(new Point(this.body[0].x + step, this.body[0].y));		
					this.body.pop();					
				} else {
					this.body[0].x = canvas.width - this.point_size;
					this.game_over = true;
				} 
				break;

			case SnakeDirections.DOWN:
				if (this.body[0].y < canvas.height - this.point_size) { 
					this.body.unshift(new Point(this.body[0].x, this.body[0].y + step));		
					this.body.pop();
				} else { 
					this.body[0].y = canvas.height - this.point_size; 
					this.game_over = true;
				}
				break;		
		}

		// check for self collision
		if (this.body.length > 1) {
			for (var i = 1; i < this.body.length; i++) {			
				if (this.body[0].collideWith(this.body[i].x, this.body[i].y)) {
					this.game_over = true;
				}
			}
		}

		if (this.body[0].collideWith(this.eat.x, this.eat.y)) {
			eat_x = Math.floor(getRandomRange(0, canvas.width - this.point_size) / this.point_size) * this.point_size;
			eat_y = Math.floor(getRandomRange(0, canvas.height - this.point_size) / this.point_size) * this.point_size;
			this.eat = new Point(eat_x, eat_y);
			this.body.push(new Point(eat_x, eat_y));
			this.score += 10;
			if (this.score > 250) {
				this.game_win = true;
			}
		}
	}

}
