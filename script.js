(function () {
  // ----- DOM references -----
  const inputField = document.getElementById('usernameInput');
  const searchButton = document.getElementById('searchBtn');
  const statusDiv = document.getElementById('statusMessage');
  const profileCard = document.getElementById('profileCard');


  const avatarImg = document.getElementById('avatarImg');
  const displayName = document.getElementById('displayName');
  const usernameHandle = document.getElementById('usernameHandle');
  const bioText = document.getElementById('bioText');
  const reposCount = document.getElementById('reposCount');
  const followersCount = document.getElementById('followersCount');
  const followingCount = document.getElementById('followingCount');
  const githubLink = document.getElementById('githubProfileLink');

  function setStatus(message, isError = false) {
    statusDiv.textContent = message || '';
    if (isError) {
      statusDiv.classList.add('error');
    } else {
      statusDiv.classList.remove('error');
    }
  }

  function hideProfile() {
    profileCard.classList.remove('visible');
  }

  function showProfile() {
    profileCard.classList.add('visible');
  }
  function resetProfileFields() {
    avatarImg.src = '';
    displayName.textContent = '—';
    usernameHandle.textContent = '@—';
    bioText.textContent = '—';
    bioText.classList.remove('empty');
    reposCount.textContent = '0';
    followersCount.textContent = '0';
    followingCount.textContent = '0';
    githubLink.href = '#';
  }

  async function fetchGitHubProfile(username) {
    const user = username.trim();
    if (!user) {
      setStatus('please enter a GitHub username', true);
      hideProfile();
      return;
    }

    setStatus('loading profile…');
    hideProfile();

    try {
    
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(user)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('user not found — try another name');
        } else {
          throw new Error(`request failed (status ${response.status})`);
        }
      }

      const data = await response.json();

      avatarImg.src =
        data.avatar_url ||
        'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
      avatarImg.alt = `${data.login}'s avatar`;

      displayName.textContent = data.name || data.login;
      usernameHandle.textContent = `@${data.login}`;

      if (data.bio) {
        bioText.textContent = data.bio;
        bioText.classList.remove('empty');
      } else {
        bioText.textContent = 'no bio provided';
        bioText.classList.add('empty');
      }

      reposCount.textContent = data.public_repos ?? 0;
      followersCount.textContent = data.followers ?? 0;
      followingCount.textContent = data.following ?? 0;

      githubLink.href = data.html_url;

      setStatus(`showing profile for @${data.login}`);
      showProfile();
    } catch (error) {
      hideProfile();
      setStatus(error.message, true);
      resetProfileFields();
    }
  }
  searchButton.addEventListener('click', () => {
    fetchGitHubProfile(inputField.value);
  });

  inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      fetchGitHubProfile(inputField.value);
    }
  });
})();