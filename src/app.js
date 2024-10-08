const inputForm = document.getElementById("input-form");
const submitButton = document.getElementById("input-form-submit");
const feedDisplay = document.querySelector('#feed')


submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  const urlInput = inputForm.url.value;

  fetchData("api/post_images", { url: urlInput },
    (res) => {
      sendToChannelWait(res.result, 0)
    }, (err) => {
      console.log(err, 'error');
    })

})

function sendToChannelWait(data, index) {
  if (data.length != index) {
    sendToChannel(data[index].src, () => {
      console.log("Success", index);
      const item = `<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span><strong>Sucess!</strong> ` + index + ` image send to telegram channel.<br>`
      feedDisplay.insertAdjacentHTML("beforeend", item)
      setTimeout(() => {
        sendToChannelWait(data, index + 1)
      }, 5000);
    })
  } else {
    console.log("All Data Send");
    const item = `<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span><strong>All Data Send!</strong> image send to telegram channel.<br>`
    feedDisplay.insertAdjacentHTML("beforeend", item)
  }
}

function sendToChannel(imageUrl, onSuccess) {
  const sendPhoto = "https://api.telegram.org/bot5631063008:AAHODcV3Lrt_gtZBTub_M-gbbbX7_n4ob8E/sendPhoto"

  const dt = {
    chat_id: '@savetelegraph',
    photo: imageUrl,
  }

  fetchData(sendPhoto, dt, (res) => {
    onSuccess(res)
  }, (err) => {
    console.log("gagal", err);
  })
}

function fetchData(url, post, onSuccess, onFailed) {
  if (post) {
    post = Object.keys(post).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(post[key]);
    }).join('&');
  }

  fetch(url, {
    method: post ? 'POST' : 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: post,
    data: post,
    Cache: "no-store",
    Pragma: "no-cache",
    ['Cache-Control']: "no-store",
    mode: "cors",
  }).then(async (res) => {
    var resText = await res.text()
    this.resStatus = res.status
    var resJson = (resText.startsWith("{") || resText.startsWith("[")) ? JSON.parse(resText) : null
    if (resJson) {
      onSuccess(resJson)
    } else {
      onFailed(resJson)
    }
  }).catch((er) => {
    console.log(er, "error");
  })
}
