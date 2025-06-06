window.onload = function() {
  window.onbeforeprint = function() {
    addFootnote();
  };
};

function addFootnote() {
  var footer = document.createElement('footer');
  footer.classList.add('footnote');
  document.body.appendChild(footer);
}

document.addEventListener('DOMContentLoaded', function() {
  const researchExperienceList = document.getElementById('research-experience-list');
  const workExperienceList = document.getElementById('work-experience-list');
  const educationList = document.getElementById('education-list');
  const teachingList = document.getElementById('teaching-list');
  const publicationList = document.getElementById('publication-list');
  const awardList = document.getElementById('award-list');
  const serviceList = document.getElementById('service-list');
  // Load experience data
  fetch('assets/research-experience.json')
    .then(response => response.json())
    .then(data => populateList(data, researchExperienceList));

  // Load work experience data
  fetch('assets/work-experience.json')
    .then(response => response.json())
    .then(data => populateList(data, workExperienceList));

  // Load education data
  fetch('assets/education.json')
    .then(response => response.json())
    .then(data => populateList(data, educationList));

  // Load teaching data
  fetch('assets/teaching.json')
  .then(response => response.json())
  .then(data => populateList(data, teachingList));

  // Load publication data
  fetch('assets/publication.json')
  .then(response => response.json())
  .then(data => populatePublicationList(data, publicationList));

  // Load award data
  fetch('assets/award.json')
  .then(response => response.json())
  .then(data => populateList(data, awardList));

  // Load service data
  fetch('assets/service.json')
  .then(response => response.json())
  .then(data => populateList(data, serviceList));

  function populateList(data, list) {
    data.forEach(item => {
      const li = document.createElement('li');
      const itemOverview = document.createElement('div');
      const itemInfo = document.createElement('div');
      const itemTitle = document.createElement('div');
      const itemYear = document.createElement('div');
      const itemDescription = document.createElement('div');
      const itemLocation = document.createElement('div');

      itemOverview.classList.add('item-overview');
      itemInfo.classList.add('item-info');
      itemTitle.classList.add('item-title');
      itemYear.classList.add('item-year');
      itemDescription.classList.add('item-description');
      itemLocation.classList.add('item-location')

      if (item.overview) {
        itemOverview.textContent = item.overview;
      }
      if (item.title) {
        itemTitle.textContent = item.title;
        itemYear.textContent = item.year;
        itemLocation.innerHTML = item.location;
      }
      
      if (Array.isArray(item.description)) {
        // If description is an array of strings
        const descriptionList = document.createElement('ul');
        item.description.forEach(desc => {
          const listItem = document.createElement('li');
          listItem.innerHTML = desc;
          descriptionList.appendChild(listItem);
        });
        itemDescription.appendChild(descriptionList);
      } else {
        // If description is a key-value map
        const descriptionList = document.createElement('ul');
        const descriptionKeys = Object.keys(item.description);
        descriptionKeys.forEach(key => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `<strong>${key}:</strong> ${item.description[key]}`;
          descriptionList.appendChild(listItem);
        });
        itemDescription.appendChild(descriptionList);
      }

      itemInfo.appendChild(itemTitle);
      itemInfo.appendChild(itemYear);
      
      if (item.overview) {
        li.appendChild(itemOverview);
      }
      if (item.title) {
        li.appendChild(itemInfo);
        li.appendChild(itemLocation);
      }  
      if (item.description) {
        li.appendChild(itemDescription);
      }
      list.appendChild(li);
    });
  }

  function populatePublicationList(publications) {
    publications.forEach((publication, index) => {
      const publicationDiv = document.createElement('div');
      publicationDiv.setAttribute('id', publication.abbr)
      publicationDiv.classList.add('publication');

      // Create and append publication number
      const publicationNumber = document.createElement('span');
      publicationNumber.classList.add('publication-number');
      publicationNumber.textContent = `[${index + 1}] `;
      publicationDiv.appendChild(publicationNumber);

      // Create and append publication content
      const publicationContent = document.createElement('div');
      publicationContent.classList.add('publication-content');

      // Authors
      const authors = document.createElement('span');
      authors.classList.add('publication-authors');
      authors.innerHTML = `${publication.author}. `;
      publicationContent.appendChild(authors);
      // Title
      const title = document.createElement('span');
      title.classList.add('publication-title');
      title.textContent = `"${publication.title}". `;
      publicationContent.appendChild(title);
      // Conference
      const conference = document.createElement('span');
      conference.classList.add('publication-conference');
      conference.innerHTML = `${publication.conference}. `;
      publicationContent.appendChild(conference)
      // Year
      const year = document.createElement('span');
      year.classList.add('publication-year');
      year.textContent = `${publication.year}. `;
      publicationContent.appendChild(year);

      const links = document.createElement('span');
      links.classList.add('publication-links');
      links.innerHTML = ` <a href="${publication.arxivLink}" target="_blank">[Paper Link]</a>.`;
      publicationContent.appendChild(links);

      publicationDiv.appendChild(publicationContent);

      // Create and append publication links container
      const linksContainer = document.createElement('span');
      linksContainer.classList.add('publication-links');
      

      publicationDiv.appendChild(publicationContent);
      publicationList.appendChild(publicationDiv);
    });
  }
});
