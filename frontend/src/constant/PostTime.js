
function getRelativeTime(date) {

const postDate = new Date(date);

  const now = new Date();
  const diffInMilliseconds = now - postDate;
  
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = now.getMonth() - postDate.getMonth() + (12 * (now.getFullYear() - postDate.getFullYear()));

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {

    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {

    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 30) {

    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInMonths < 12) {

    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  } else {

    return `${postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
}

export default getRelativeTime