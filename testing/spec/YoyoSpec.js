describe("Yoyo", function() {
  var yoyo;
  var yoyo_data;

  beforeEach(function() {

    yoyo_data = yoyos[0];
    yoyo = new Yoyo(yoyo_data.model, yoyo_data.img_url, yoyo_data.color_hex, yoyo_data.diameter_mm, yoyo_data.width_mm, yoyo_data.weight_g);
  });

  it("should have its name set to the yoyo data model name.", function() {
    expect(yoyo.model).toEqual("Arctic Circle");
  });

  it("should assign a unique ID to each object, starting with 1", function() {
    expect(yoyo.id_num).toBeDefined();
  });

  it("should auto-increment that ID number for each new Yoyo instance created", function() {
    var yoyo2 = new Yoyo("whatever","doesntmatter",3,2,1);
    expect(yoyo2.id_num).toBe(yoyo.id_num+1);
  });

  it("should be able to spit out an object that D3 can turn into a graph.", function() {
    expect(yoyo.convert_to_radar_array()).toEqual(
    [
      {
        axis: "diameter",
        value: 11.8
      },
      {
        axis: "width",
        value: 16.4
      },
      {
        axis: "weight",
        value: 10.5
      }
    ]);
  });




  it("should be able to draw the graph.", function() {
    color_list  = build_color_array(yoyos[0]);
    radar_nodes = [];
    radar_data = 
    [
      yoyo.convert_to_radar_array()
    ];

    RadarChart.draw("#chart", radar_data);

  });

  // it("should be able to play a Song", function() {
  //   player.play(song);
  //   expect(player.currentlyPlayingSong).toEqual(song);

  //   //demonstrates use of custom matcher
  //   expect(player).toBePlaying(song);
  // });

  // describe("when song has been paused", function() {
  //   beforeEach(function() {
  //     player.play(song);
  //     player.pause();
  //   });

  //   it("should indicate that the song is currently paused", function() {
  //     expect(player.isPlaying).toBeFalsy();

  //     // demonstrates use of 'not' with a custom matcher
  //     expect(player).not.toBePlaying(song);
  //   });

  //   it("should be possible to resume", function() {
  //     player.resume();
  //     expect(player.isPlaying).toBeTruthy();
  //     expect(player.currentlyPlayingSong).toEqual(song);
  //   });
  // });

  // // demonstrates use of spies to intercept and test method calls
  // it("tells the current song if the user has made it a favorite", function() {
  //   spyOn(song, 'persistFavoriteStatus');

  //   player.play(song);
  //   player.makeFavorite();

  //   expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  // });

  // //demonstrates use of expected exceptions
  // describe("#resume", function() {
  //   it("should throw an exception if song is already playing", function() {
  //     player.play(song);

  //     expect(function() {
  //       player.resume();
  //     }).toThrowError("song is already playing");
  //   });
  // });
});

