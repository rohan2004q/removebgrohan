document.addEventListener('DOMContentLoaded', function() {
  const uploadButton = document.getElementById('upload-button');
  const fileInput = document.getElementById('file-input');
  const uploadArea = document.querySelector('.upload-area');
  const imagePreview = document.getElementById('image-preview');
  const downloadButton = document.getElementById('download-button');


  
  uploadButton.addEventListener('click', function() {
      fileInput.click();
  });

  fileInput.addEventListener('change', function(event) {
      handleFile(event.target.files[0]);
  });

  uploadArea.addEventListener('dragover', function(event) {
      event.preventDefault();
      uploadArea.style.backgroundColor = '#e0e0e0';
  });

  uploadArea.addEventListener('dragleave', function() {
      uploadArea.style.backgroundColor = '#f0f8ff';
  });

  uploadArea.addEventListener('drop', function(event) {
      event.preventDefault();
      uploadArea.style.backgroundColor = '#f0f8ff';
      handleFile(event.dataTransfer.files[0]);
  });

  let currentFilename = '';

  function handleFile(file) {
      if (file && file.type.startsWith('image/')) {
          const formData = new FormData();
          formData.append('file', file);

          // Show loading state
          imagePreview.innerHTML = 'Processing...';
          downloadButton.style.display = 'none';

          fetch('/process_image', {
              method: 'POST',
              body: formData
          })
          .then(response => response.json())
          .then(data => {
              if (data.error) {
                  throw new Error(data.error);
              }
              currentFilename = data.filename;
              const img = document.createElement('img');
              img.src = data.image_url;
              img.classList.add('image-preview');
              imagePreview.innerHTML = '';
              imagePreview.appendChild(img);
              downloadButton.style.display = 'block';
          })
          .catch(error => {
              console.error('Error:', error);
              imagePreview.innerHTML = 'Error processing image';
              alert(error.message || 'Failed to process image. Please try again.');
          });
      } else {
          alert('Please select a valid image file.');
      }
  }

  downloadButton.addEventListener('click', function() {
      if (currentFilename) {
          window.location.href = `/download?filename=${currentFilename}`;
      } else {
          alert('No processed image available to download.');
      }
  });

  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Add hover effect to navbar links
  document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'scale(1.1)';
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'scale(1)';
    });
  });
});