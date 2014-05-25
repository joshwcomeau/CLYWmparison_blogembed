describe("List Builders", function() {
  var yoyo, yoyo_object, yoyo_list;

  beforeEach(function() {
    yoyo = yoyos[0];
    yoyo_object = new Yoyo(yoyo.model, yoyo.img_url, yoyo.diameter_mm, yoyo.width_mm, yoyo.weight_g);
    yoyo_list = build_object_array(yoyos_testing);
  });


  it("should be able to iterate through our yoyo data array, creating yoyo objects for each one.", function() {
    expect(yoyo_list[0].model).toEqual(yoyo_object.model);
  });

  it("should create 1 yoyo object for every 1 item in the yoyo_data JS file.", function () {
    expect(yoyo_list.length).toEqual(yoyos.length);
  });

  it("should create the array our radar-chart needs.", function() {
    radar_list = build_radar_array(yoyo_list);
    expect(radar_list[0][0].axis).toBe("diameter");
  });

  it("should create an array full of hex color codes", function() {
    var color_list = build_color_array(yoyo_list);
    expect(color_list[0]).toMatch(/^#[a-zA-Z0-9]{6}$/);
  })

  it("should draw the radar chart", function() {
    radar_list = build_radar_array(yoyo_list);
    RadarChart.draw("#chart", radar_list);
  })

  it("should build our avatar list.", function() {
    build_avatar_array(yoyo_list, "#yoyo_selection_wrapper");
    expect(d3.selectAll(".yoyo_avatar").size()).toBe(5);
  })

  it("should bind a mouseover event listener", function() {
    // How do I test for this?
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
