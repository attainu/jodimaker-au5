$(document).ready(function () {
  const hobbies = [
    "3D printing",
    "amateur radio",
    "scrapbook",
    "Amateur radio",
    "Acting",
    "Baton twirling",
    "Board games",
    "Book restoration",
    "Cabaret",
    "Calligraphy",
    "Candle making",
    "Computer programming",
    "Coffee roasting",
    "Cooking",
    "Coloring",
    "Cosplaying",
    "Couponing",
    "Creative writing",
    "Crocheting",
    "Cryptography",
    "Dance",
    "Digital arts",
    "Drama",
    "Drawing",
    "Do it yourself",
    "Electronics",
    "Embroidery",
    "Fashion",
    "Flower arranging",
    "Foreign language learning",
    "Gaming",
    "tabletop games",
    "role-playing games",
    "Gambling",
    "Genealogy",
    "Glassblowing",
    "Gunsmithing",
    "Homebrewing",
    "Ice skating",
    "Jewelry making",
    "Jigsaw puzzles",
    "Juggling",
    "Knapping",
    "Knitting",
    "Kabaddi",
    "Knife making",
    "Lacemaking",
    "Lapidary",
    "Leather crafting",
    "Lego building",
    "Lockpicking",
    "Machining",
    "Macrame",
    "Metalworking",
    "Magic",
    "Model building",
    "Listening to music",
    "Origami",
    "Painting",
    "Playing musical instruments",
    "Pet",
    "Poi",
    "Pottery",
    "Puzzles",
    "Quilting",
    "Reading",
    "Scrapbooking",
    "Sculpting",
    "Sewing",
    "Singing",
    "Sketching",
    "Soapmaking",
    "Sports",
    "Stand-up comedy",
    "Sudoku",
    "Table tennis",
    "Taxidermy",
    "Video gaming",
    "Watching movies",
    "Web surfing",
    "Whittling",
    "Wood carving",
    "Woodworking",
    "Worldbuilding",
    "Writing",
    "Yoga",
    "Yo-yoing",
    "Air sports",
    "Archery",
    "Astronomy",
    "Backpacking",
    "BASE jumping",
    "Baseball",
    "Basketball",
    "Beekeeping",
    "Bird watching",
    "Blacksmithing",
    "Board sports",
    "Bodybuilding",
    "Brazilian jiu-jitsu",
    "Community",
    "Cycling",
    "Dowsing",
    "Driving",
    "Fishing",
    "Flag Football",
    "Flying",
    "Flying disc",
    "Foraging",
    "Gardening",
    "Geocaching",
    "Ghost hunting",
    "Graffiti",
    "Handball",
    "Hiking",
    "Hooping",
    "Horseback riding",
    "Hunting",
    "Inline skating",
    "Jogging",
    "Kayaking",
    "Kite flying",
    "Kitesurfing",
    "LARPing",
    "Letterboxing",
    "Metal detecting",
    "Motor sports",
    "Mountain biking",
    "Mountaineering",
    "Mushroom hunting",
    "Mycology",
    "Netball",
    "Nordic skating",
    "Orienteering",
    "Paintball",
    "Parkour",
    "Photography",
    "Polo",
    "Rafting",
    "Rappelling",
    "Rock climbing",
    "Roller skating",
    "Rugby",
    "Running",
    "Sailing",
    "Sand art",
    "Scouting",
    "Scuba diving",
    "Sculling",
    "Rowing",
    "Shooting",
    "Shopping",
    "Skateboarding",
    "Skiing",
    "Skimboarding",
    "Skydiving",
    "Slacklining",
    "Snowboarding",
    "Stone skipping",
    "Surfing",
    "Swimming",
    "Taekwondo",
    "Tai chi",
    "Urban exploration",
    "Vacation",
    "Vehicle restoration",
    "Water sports"
  ];

  var educationlevel = [
    "doctrate",
    "masters",
    "honours degree",
    "bachelors",
    "undergraduate",
    "associates degree",
    "high school",
    "less than high school",
    "trade school"
  ];

  for (let i = 0; i < educationlevel.length; i++) {
    $(".educationlevel").append(
      `<option class="custom-control-label" value="${educationlevel[i]}">${educationlevel[i]}</option>`
    );
  }

  for (let i = 0; i < hobbies.length; i++) {
    $(".hobbies").append(`
          <option  name="hobbies" value="${hobbies[i]}">${hobbies[i]}</option>
      `);
  }
  $(".hobbies").select2({
    tags: true
  })
  // add hobbies button
  var max_fields = 10;
  var wrapper = $(".input_fields_wrap");
  var add_button = $(".add_field_button");
  var x = 1;
  $(add_button).click(function (e) {
    e.preventDefault();
    if (x < max_fields) {
      x++;
      $(wrapper).append(
        `<div><input type="text" name="hobbies" class="form-control mt-4" placeholder="Hobby"><a href="#" class="remove_field btn btn-link">Remove</a></div>`
      );
    } else {
      $(wrapper).append(`<h1 class="text-center">Stop lying Dude!!!</h1>`);
    }
  });
  $(wrapper).on("click", ".remove_field", function (e) {
    e.preventDefault();
    $(this)
      .parent("div")
      .remove();
    x--;
  });
  //Slider
  var slider = document.getElementById("customRange1");
  var output = document.getElementById("sliderValue");
  output.innerHTML = slider.value;
  slider.oninput = function () {
    output.innerHTML = this.value;
  };

  $("#yes").on("click", function () {
    $(".isEmployed").show()
    $('input[name="employer"]').attr("required");
  });
  $("#no").on("click", function () {
    $(".isEmployed").hide()
    $('input[name="employer"]').removeAttr("required")
  });




  // new implementation

  const tagContainer = document.querySelector('.tag-container');
  const input = document.querySelector('.tag-container input');

  let tags = [];

  function createTag(label) {
    const div = document.createElement('div');
    div.setAttribute('class', 'tag');
    const span = document.createElement('span');
    span.innerHTML = label;
    const closeIcon = document.createElement('i');
    closeIcon.innerHTML = 'close';
    closeIcon.setAttribute('class', 'material-icons');
    closeIcon.setAttribute('data-item', label);
    div.appendChild(span);
    div.appendChild(closeIcon);
    return div;
  }

  function clearTags() {
    document.querySelectorAll('.tag').forEach(tag => {
      tag.parentElement.removeChild(tag);
    });
  }

  function addTags() {
    clearTags();
    tags.slice().reverse().forEach(tag => {
      tagContainer.prepend(createTag(tag));
    });
  }

  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      e.target.value.split(',').forEach(tag => {
        tags.push(tag);
      });

      addTags();
      input.value = '';
    }
  });
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'I') {
      const tagLabel = e.target.getAttribute('data-item');
      const index = tags.indexOf(tagLabel);
      tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
      addTags();
    }
  })

  input.focus();


});
