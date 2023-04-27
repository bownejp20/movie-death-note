var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var knife = document.getElementsByClassName("ph-knife");
var skull = document.getElementsByClassName("ph-skull");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const note = this.parentNode.parentNode.childNodes[3].innerText
        // const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText) // dont need this because of what we did on the DB
        console.log(name, note, thumbUp)
        console.log(this.parentNode.parentNode.childNodes)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            name,
            note,
            // 'thumbUp':thumbUp //also dont need this because of the inc 1 in DB 
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(knife).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const note = this.parentNode.parentNode.childNodes[3].innerText
    // const knife = parseFloat(this.parentNode.parentNode.childNodes[9].innerText)
    fetch('messages/knife', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'note': note,
        // 'knife':knife
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

Array.from(skull).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const note = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'note': note
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
