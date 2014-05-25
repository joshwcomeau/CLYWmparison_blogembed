describe("Yoyo", function() {
  var yoyo;

  beforeEach(function() {
    yoyo_data = {
      model:        "Arctic Circle 2",
      img_url:      "ac2_compact.png",
      diameter_mm:  56,
      width_mm:     48,
      weight_g:     66
    };
    yoyo = new Yoyo(yoyo_data.model, yoyo_data.diameter_mm, yoyo_data.width_mm, yoyo_data.weight_g);
  });

  it("should have its name set to the yoyo data model name", function() {
    expect(yoyo.model)
    .toEqual("Arctic Circle 2");
  })

  it("should be able to spit out an object that D3 can turn into a graph", function() {
    expect(yoyo.convert_to_radar_array())
    .toEqual([
      {
        axis: "diameter",
        value: 56
      },
      {
        axis: "width",
        value: 48
      },
      {
        axis: "weight",
        value: 66
      }
    ]);
  });

  it("should be able to draw the graph", function() {
    radar_data = 
    [
      yoyo.convert_to_radar_array()
    ];

    RadarChart.draw("#chart", radar_data);

  });

  it("should be able to iterate through our yoyo data array, creating yoyo objects for each one.", function() {

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
