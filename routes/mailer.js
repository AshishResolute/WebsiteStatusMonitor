

function mailDetails(user, url, status) {
    let message = {
        from: `Ashish@backend.dev`,
        to: user,
        url,
        subject: `Website ${status} Notification`,
        text: `${url} is currently ${status}`
    }
    return message
}

export default mailDetails;