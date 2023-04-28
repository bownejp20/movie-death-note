var skull = document.getElementsByClassName("ph-skull");


Array.from(skull).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        console.log(name, msg)
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
