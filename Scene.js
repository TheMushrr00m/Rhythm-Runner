var Scene = {};

Scene.load = function(audio, bpm) {
	Scene.audio = audio;
	Scene.bpm = bpm;
	Scene.runSpeed = 5;
	Scene.viewportWidth = 30;
	Scene.components = LevelGenerator.generate(Scene.bpm);
	Scene.players = [new Player("yellow", "arrows")];
	audio.muted = true;
	audio.play();
};

Scene.scrolled = function() {
	return Scene.audio.currentTime * Scene.runSpeed;
};

Scene.beatPercentage = function() {
	return (Scene.audio.currentTime % (60 / Scene.bpm)) / (60 / Scene.bpm);
};

Scene.render = function() {
	var color = Math.round(Math.sqrt(Scene.beatPercentage() * 255) * Math.sqrt(255));
	Main.context.fillStyle = "rgb(100, 0, " + color + ")";
	Main.context.fillRect(0, 0, Main.context.canvas.width, Main.context.canvas.height);
	
	var scroll = Scene.scrolled();
	Draw.globalOffset(scroll, Main.context.canvas.height * 2 / 3);
	Draw.scale(Main.context.canvas.width / this.viewportWidth);
	
	Scene.components.forEach(function(component) {
		if (component.x - scroll + component.width > 0 && component.x < scroll + Scene.viewportWidth) {
			Draw.offset(component.x, component.y - component.height);
			component.draw();
			Draw.debugHitbox(component.width, component.height);
			Draw.offset(0, 0);
		}
	});
	
	Scene.players.forEach(function(player, index) {
		player.x = scroll + (index + 1) * 3;
		Draw.offset(player.x, player.y - player.height);
		player.draw();
		Draw.debugHitbox(player.width, player.height);
		Draw.offset(0, 0);
	});
	
	Draw.scale(1);
	Draw.globalOffset(0, 0);
	
	Main.context.fillStyle = "#fff";
	Main.context.font = "12px sans-serif";
	Main.context.textAlign = "left";
	Main.context.textBaseline = "top";
	Main.context.fillText(Scene.bpm + " BPM", 0, 0);
};
