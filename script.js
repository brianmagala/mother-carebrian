// Tuinaune Growth Environment - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initDonationSystem();
    initVolunteerForm();
    initNewsletterForm();
    initSponsorButtons();
    initSmoothScrolling();
    initAccessibility();
    initModal();
    
    // Add animation to stats counter
    animateStats();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainMenu = document.getElementById('mainMenu');
    
    if (mobileMenuBtn && mainMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
            
            // Update ARIA label
            const isExpanded = mainMenu.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mainMenu.contains(event.target)) {
                mainMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Donation System
function initDonationSystem() {
    // Amount selection
    const amountOptions = document.querySelectorAll('.amount-option');
    const customAmountInput = document.querySelector('.custom-amount');
    
    amountOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            amountOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            // Set custom amount input to selected value
            const amount = this.getAttribute('data-amount');
            customAmountInput.value = amount;
            
            // Update donation button text
            updateDonationButton(amount);
        });
    });
    
    // Custom amount input
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            // Remove active class from all amount options when typing custom amount
            amountOptions.forEach(opt => opt.classList.remove('active'));
            
            // Update donation button text
            const amount = this.value;
            updateDonationButton(amount);
        });
        
        customAmountInput.addEventListener('focus', function() {
            amountOptions.forEach(opt => opt.classList.remove('active'));
        });
    }
    
    // Payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentDetails = document.querySelector('.payment-details');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            // Add active class to clicked method
            this.classList.add('active');
            
            // Show/hide payment details based on selection
            const methodType = this.getAttribute('data-method');
            updatePaymentDetails(methodType);
        });
    });
    
    // Donation form submission
    const donateButton = document.getElementById('donateButton');
    if (donateButton) {
        donateButton.addEventListener('click', function(e) {
            e.preventDefault();
            processDonation();
        });
    }
}

function updateDonationButton(amount) {
    const donateButton = document.getElementById('donateButton');
    if (donateButton && amount) {
        const amountText = amount ? `Donate $${amount} Now` : 'Donate Securely Now';
        donateButton.innerHTML = `<i class="fas fa-lock"></i> ${amountText}`;
    }
}

function updatePaymentDetails(methodType) {
    const paymentDetails = document.querySelector('.payment-details');
    if (!paymentDetails) return;
    
    // In a real implementation, this would show different forms for different payment methods
    if (methodType === 'credit') {
        paymentDetails.innerHTML = `
            <div class="form-group">
                <label for="cardnumber">Card Number</label>
                <input type="text" id="cardnumber" class="form-control" placeholder="1234 5678 9012 3456">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="expiry">Expiry Date</label>
                    <input type="text" id="expiry" class="form-control" placeholder="MM/YY">
                </div>
                <div class="form-group">
                    <label for="cvc">CVC</label>
                    <input type="text" id="cvc" class="form-control" placeholder="123">
                </div>
            </div>
        `;
    } else if (methodType === 'paypal') {
        paymentDetails.innerHTML = `
            <div class="form-group">
                <p>You will be redirected to PayPal to complete your donation securely.</p>
            </div>
        `;
    } else if (methodType === 'mobile') {
        paymentDetails.innerHTML = `
            <div class="form-group">
                <label for="mobile-provider">Mobile Provider</label>
                <select id="mobile-provider" class="form-control">
                    <option value="">Select provider</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="airtelmoney">Airtel Money</option>
                    <option value="orange">Orange Money</option>
                    <option value="mtn">MTN Mobile Money</option>
                </select>
            </div>
            <div class="form-group">
                <label for="mobile-number">Mobile Number</label>
                <input type="tel" id="mobile-number" class="form-control" placeholder="07XX XXX XXX">
            </div>
        `;
    }
}

function processDonation() {
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const amount = document.querySelector('.amount-option.active')?.getAttribute('data-amount') || 
                   document.querySelector('.custom-amount').value;
    
    // Basic validation
    if (!fullname || !email) {
        showNotification('Please fill in your name and email address to proceed.', 'error');
        return;
    }
    
    if (!amount || isNaN(amount) || amount <= 0) {
        showNotification('Please enter a valid donation amount.', 'error');
        return;
    }
    
    // Get selected donation type
    const donationType = document.querySelector('input[name="donation-type"]:checked')?.value || 'general';
    
    // Show loading state
    const donateButton = document.getElementById('donateButton');
    const originalText = donateButton.innerHTML;
    donateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    donateButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Generate reference number
        const referenceNumber = 'TGE-' + Date.now().toString().slice(-8);
        
        // Show success modal
        showDonationModal(fullname, email, amount, referenceNumber, donationType);
        
        // Reset button
        donateButton.innerHTML = originalText;
        donateButton.disabled = false;
        
        // Reset form (in a real implementation, you might not want to do this)
        document.getElementById('fullname').value = '';
        document.getElementById('email').value = '';
        document.querySelector('.custom-amount').value = '';
        
        // Log donation for analytics (simulated)
        console.log(`Donation processed: $${amount} by ${fullname} for ${donationType}`);
    }, 1500);
}

// Volunteer Form
function initVolunteerForm() {
    const volunteerForm = document.getElementById('volunteerForm');
    
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('volunteerName').value;
            const email = document.getElementById('volunteerEmail').value;
            const message = document.getElementById('volunteerMessage').value;
            
            // Get selected interests
            const interests = [];
            document.querySelectorAll('.interest-option input:checked').forEach(checkbox => {
                interests.push(checkbox.value);
            });
            
            if (!name || !email) {
                showNotification('Please fill in your name and email address.', 'error');
                return;
            }
            
            // Show loading
            const submitBtn = volunteerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showNotification(`Thank you, ${name}! Your volunteer application has been submitted. We will contact you shortly.`, 'success');
                
                // Reset form
                volunteerForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Log for analytics
                console.log(`Volunteer application: ${name}, Interests: ${interests.join(', ')}`);
            }, 1000);
        });
    }
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (!email || !isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalIcon = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Simulate subscription
            setTimeout(() => {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                
                // Reset form
                newsletterForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalIcon;
                submitBtn.disabled = false;
                
                // Log for analytics
                console.log(`Newsletter subscription: ${email}`);
            }, 800);
        });
    }
}

// Sponsor Buttons
function initSponsorButtons() {
    const sponsorButtons = document.querySelectorAll('.sponsor-btn');
    
    sponsorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const childName = this.getAttribute('data-child');
            
            // Set donation type to sponsor this specific child
            const sponsorRadio = document.querySelector('input[name="donation-type"][value="sponsor"]');
            if (sponsorRadio) {
                sponsorRadio.checked = true;
            }
            
            // Scroll to donation section
            document.getElementById('donate').scrollIntoView({ behavior: 'smooth' });
            
            // Show notification
            showNotification(`You've selected to sponsor ${childName}. Please complete the donation form below.`, 'info');
        });
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const mainMenu = document.getElementById('mainMenu');
                if (mainMenu && mainMenu.classList.contains('active')) {
                    mainMenu.classList.remove('active');
                    const menuBtn = document.getElementById('mobileMenuBtn');
                    if (menuBtn) {
                        const icon = menuBtn.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                        menuBtn.setAttribute('aria-expanded', 'false');
                    }
                }
                
                // Calculate scroll position (account for fixed header)
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Accessibility Features
function initAccessibility() {
    // Add keyboard navigation indicators
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('focus-visible');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('focus-visible');
    });
    
    // Improve focus for modal
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
}

// Modal System
function initModal() {
    const modal = document.getElementById('donationModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeModalBtn2 = document.getElementById('closeModalBtn');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (closeModalBtn2) {
        closeModalBtn2.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

function showDonationModal(name, email, amount, reference, type) {
    const modal = document.getElementById('donationModal');
    const donorEmail = document.getElementById('donorEmail');
    const referenceNumber = document.getElementById('referenceNumber');
    
    if (modal && donorEmail && referenceNumber) {
        donorEmail.textContent = email;
        referenceNumber.textContent = reference;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Focus on close button for accessibility
        setTimeout(() => {
            const closeBtn = modal.querySelector('.close-modal');
            if (closeBtn) closeBtn.focus();
        }, 100);
    }
}

function closeModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Stats Counter Animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        const suffix = stat.textContent.replace(/[0-9]/g, '');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + suffix;
        }, 16);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        font-family: 'Poppins', sans-serif;
    `;
    
    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: 15px;
                padding: 5px;
                border-radius: 4px;
            }
            .notification-close:hover {
                background-color: rgba(255,255,255,0.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
    
    document.body.appendChild(notification);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#4CAF50';
        case 'error': return '#e74c3c';
        case 'warning': return '#ffc107';
        default: return '#4a6fa5';
    }
}

// Email validation helper
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Form validation helper
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            // Add error message if not already present
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                errorMsg.style.cssText = 'color: #e74c3c; font-size: 0.8rem; display: block; margin-top: 5px;';
                input.parentNode.appendChild(errorMsg);
            }
        } else {
            input.classList.remove('error');
            
            // Remove error message if present
            const errorMsg = input.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }
    });
    
    return isValid;
}