export const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.classList.add("notification", `notification-${type}`);
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
    }
        