
        // Admin Data Storage
        let adminData = {
            students: JSON.parse(localStorage.getItem('pisoprint_students') || '[]'),
            transactions: JSON.parse(localStorage.getItem('pisoprint_transactions') || '[]')
        };

        // Generate Card ID in format 4902-XXXX-XXX-X
        function generateCardID() {
            const timestamp = Date.now().toString();
            const random1 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            const random2 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const random3 = Math.floor(Math.random() * 10).toString();
            
            return `4902-${random1}-${random2}-${random3}`;
        }



        // Admin Portal Functions
        function toggleAdminPortal() {
            const portal = document.getElementById('adminPortal');
            const btn = document.getElementById('adminToggleBtn');
            
            if (portal.style.display === 'none') {
                portal.style.display = 'block';
                btn.textContent = '❌ Close Admin Portal';
            } else {
                portal.style.display = 'none';
                btn.textContent = '🔐 Admin Portal';
                adminLogout();
            }
        }

        function adminLogin() {
            const password = document.getElementById('adminPassword').value;
            if (password === 'admin123') {
                document.getElementById('adminLogin').style.display = 'none';
                document.getElementById('adminDashboard').style.display = 'block';
                showAdminSection('dashboard');
                showAlert('✅ Admin login successful!', 'success');
            } else {
                showAlert('❌ Invalid admin password!', 'error');
            }
        }

        function adminLogout() {
            document.getElementById('adminLogin').style.display = 'block';
            document.getElementById('adminDashboard').style.display = 'none';
            document.getElementById('adminPassword').value = '';
        }

        function showAdminSection(section) {
            document.querySelectorAll('.admin-section').forEach(el => el.style.display = 'none');
            document.getElementById(`admin${section.charAt(0).toUpperCase() + section.slice(1)}Section`).style.display = 'block';
            
            if (section === 'dashboard') {
                updateDashboard();
            } else if (section === 'students') {
                updateStudentsTable();
            } else if (section === 'transactions') {
                updateTransactionsTable();
            }
        }

        function updateDashboard() {
            const students = adminData.students;
            const transactions = adminData.transactions;
            const today = new Date().toDateString();
            
            document.getElementById('totalStudents').textContent = students.length;
            document.getElementById('todayRegistrations').textContent = 
                students.filter(s => new Date(s.registrationDate).toDateString() === today).length;
            document.getElementById('totalTransactions').textContent = transactions.length;
        }

        function updateStudentsTable() {
            const tbody = document.getElementById('studentsTableBody');
            const students = adminData.students;
            
            if (students.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #666;">No students registered yet</td></tr>';
                return;
            }
            
            tbody.innerHTML = students.map((student, index) => `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${student.name}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${student.cardID}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${student.educationLevel}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${new Date(student.registrationDate).toLocaleDateString()}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">
                        <button class="btn btn-primary" onclick="viewStudent(${index})" style="padding: 5px 10px; font-size: 12px; margin: 2px;">👁️ View</button>
                        <button class="btn btn-danger" onclick="deleteStudent(${index})" style="padding: 5px 10px; font-size: 12px; margin: 2px;">🗑️ Delete</button>
                    </td>
                </tr>
            `).join('');
        }

        function updateTransactionsTable() {
            const tbody = document.getElementById('transactionsTableBody');
            const transactions = adminData.transactions;
            
            if (transactions.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #666;">No transactions yet</td></tr>';
                return;
            }
            
            tbody.innerHTML = transactions.map((transaction, index) => `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${transaction.transactionNumber}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${transaction.studentName}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${transaction.cardID}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${new Date(transaction.dateTime).toLocaleString()}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">
                        <button class="btn btn-primary" onclick="viewTransaction(${index})" style="padding: 5px 10px; font-size: 12px; margin: 2px;">👁️ View</button>
                        <button class="btn btn-danger" onclick="deleteTransaction(${index})" style="padding: 5px 10px; font-size: 12px; margin: 2px;">🗑️ Delete</button>
                    </td>
                </tr>
            `).join('');
        }

        function generateTransactionSlip() {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const address = document.getElementById('address').value;
            const dob = document.getElementById('dob').value;
            const educationLevel = document.getElementById('educationLevel').value;

            if (!firstName || !lastName || !address || !dob || !educationLevel) {
                showAlert('Please fill in all required fields!', 'error');
                return;
            }

            // Generate unique card ID and transaction number
            const cardID = generateCardID();
            const transactionNumber = 'TXN' + Date.now().toString().slice(-10);
            
            // Get current date and time
            const now = new Date();
            const dateTime = now.toLocaleString();

            // Store student data
            const studentData = {
                cardID,
                name: `${firstName} ${lastName}`,
                firstName,
                lastName,
                address,
                dob,
                educationLevel,
                registrationDate: now.toISOString()
            };

            // Store transaction data
            const transactionData = {
                transactionNumber,
                studentName: `${firstName} ${lastName}`,
                cardID,
                dateTime: now.toISOString(),
                educationLevel
            };

            // Save to localStorage
            adminData.students.push(studentData);
            adminData.transactions.push(transactionData);
            localStorage.setItem('pisoprint_students', JSON.stringify(adminData.students));
            localStorage.setItem('pisoprint_transactions', JSON.stringify(adminData.transactions));

            // Update transaction slip
            document.getElementById('slipTransactionNumber').textContent = transactionNumber;
            document.getElementById('slipDateTime').textContent = dateTime;
            document.getElementById('slipCustomerName').textContent = `${firstName} ${lastName}`;
            document.getElementById('slipEducationLevel').textContent = educationLevel;
            document.getElementById('slipCardID').textContent = cardID;

            // Generate QR Code with card information
            const qrData = `PISO PRINT PROMO CARD
Card ID: ${cardID}
Name: ${firstName} ${lastName}
Level: ${educationLevel}
Transaction: ${transactionNumber}
Date: ${dateTime}`;
            
            generateQRCode(qrData);

            // Show transaction slip and auto-print
            document.getElementById('transactionSlip').style.display = 'block';
            
            setTimeout(() => {
                window.print();
                document.getElementById('transactionSlip').style.display = 'none';
            }, 500);

            showAlert('✅ Transaction slip generated and printing automatically!', 'success');
            
            // Reset form
            document.getElementById('studentForm').reset();
        }

        function generateQRCode(data) {
            const encodedData = encodeURIComponent(data);
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodedData}&format=png&bgcolor=FFFFFF&color=000000&margin=10`;
            
            const qrImage = document.getElementById('qrCodeImage');
            qrImage.src = qrCodeUrl;
            qrImage.style.display = 'block';
        }

        // Admin Action Functions
        function viewStudent(index) {
            const student = adminData.students[index];
            const details = `
                <strong>Student Details:</strong><br><br>
                <strong>Name:</strong> ${student.name}<br>
                <strong>Card ID:</strong> ${student.cardID}<br>
                <strong>Address:</strong> ${student.address}<br>
                <strong>Date of Birth:</strong> ${student.dob}<br>
                <strong>Education Level:</strong> ${student.educationLevel}<br>
                <strong>Registration Date:</strong> ${new Date(student.registrationDate).toLocaleString()}
            `;
            showAlert(details, 'info');
        }

        function deleteStudent(index) {
            const student = adminData.students[index];
            showConfirm(`Are you sure you want to delete student "${student.name}"?`, () => {
                adminData.students.splice(index, 1);
                localStorage.setItem('pisoprint_students', JSON.stringify(adminData.students));
                updateStudentsTable();
                updateDashboard();
                showAlert('✅ Student deleted successfully!', 'success');
            });
        }

        function viewTransaction(index) {
            const transaction = adminData.transactions[index];
            const details = `
                <strong>Transaction Details:</strong><br><br>
                <strong>Transaction ID:</strong> ${transaction.transactionNumber}<br>
                <strong>Student:</strong> ${transaction.studentName}<br>
                <strong>Card ID:</strong> ${transaction.cardID}<br>
                <strong>Education Level:</strong> ${transaction.educationLevel}<br>
                <strong>Date & Time:</strong> ${new Date(transaction.dateTime).toLocaleString()}
            `;
            showAlert(details, 'info');
        }

        function deleteTransaction(index) {
            const transaction = adminData.transactions[index];
            showConfirm(`Are you sure you want to delete transaction "${transaction.transactionNumber}"?`, () => {
                adminData.transactions.splice(index, 1);
                localStorage.setItem('pisoprint_transactions', JSON.stringify(adminData.transactions));
                updateTransactionsTable();
                updateDashboard();
                showAlert('✅ Transaction deleted successfully!', 'success');
            });
        }

        function exportStudentsData() {
            if (adminData.students.length === 0) {
                showAlert('No student data to export!', 'error');
                return;
            }
            
            const csvContent = 'Name,Card ID,Address,Date of Birth,Education Level,Registration Date\n' +
                adminData.students.map(student => 
                    `"${student.name}","${student.cardID}","${student.address}","${student.dob}","${student.educationLevel}","${new Date(student.registrationDate).toLocaleString()}"`
                ).join('\n');
            
            downloadCSV(csvContent, 'students_data.csv');
            showAlert('✅ Student data exported successfully!', 'success');
        }

        function exportTransactionsData() {
            if (adminData.transactions.length === 0) {
                showAlert('No transaction data to export!', 'error');
                return;
            }
            
            const csvContent = 'Transaction ID,Student Name,Card ID,Education Level,Date & Time\n' +
                adminData.transactions.map(transaction => 
                    `"${transaction.transactionNumber}","${transaction.studentName}","${transaction.cardID}","${transaction.educationLevel}","${new Date(transaction.dateTime).toLocaleString()}"`
                ).join('\n');
            
            downloadCSV(csvContent, 'transactions_data.csv');
            showAlert('✅ Transaction data exported successfully!', 'success');
        }

        function clearAllStudents() {
            if (adminData.students.length === 0) {
                showAlert('No student data to clear!', 'error');
                return;
            }
            
            showConfirm('Are you sure you want to delete ALL student records? This action cannot be undone!', () => {
                adminData.students = [];
                localStorage.setItem('pisoprint_students', JSON.stringify(adminData.students));
                updateStudentsTable();
                updateDashboard();
                showAlert('✅ All student records cleared!', 'success');
            });
        }

        function clearAllTransactions() {
            if (adminData.transactions.length === 0) {
                showAlert('No transaction data to clear!', 'error');
                return;
            }
            
            showConfirm('Are you sure you want to delete ALL transaction records? This action cannot be undone!', () => {
                adminData.transactions = [];
                localStorage.setItem('pisoprint_transactions', JSON.stringify(adminData.transactions));
                updateTransactionsTable();
                updateDashboard();
                showAlert('✅ All transaction records cleared!', 'success');
            });
        }

        function downloadCSV(content, filename) {
            const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function showConfirm(message, onConfirm) {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            `;

            const confirmBox = document.createElement('div');
            confirmBox.style.cssText = `
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-width: 400px;
                text-align: center;
                border-left: 5px solid #dc3545;
            `;

            confirmBox.innerHTML = `
                <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">${message}</p>
                <div>
                    <button onclick="this.closest('.confirm-overlay').remove()" 
                            style="background: #6c757d; color: white; border: none; padding: 10px 20px; 
                                   border-radius: 5px; cursor: pointer; font-weight: bold; margin: 5px;">Cancel</button>
                    <button onclick="confirmAction()" 
                            style="background: #dc3545; color: white; border: none; padding: 10px 20px; 
                                   border-radius: 5px; cursor: pointer; font-weight: bold; margin: 5px;">Confirm</button>
                </div>
            `;

            overlay.className = 'confirm-overlay';
            overlay.appendChild(confirmBox);
            document.body.appendChild(overlay);

            window.confirmAction = function() {
                onConfirm();
                overlay.remove();
                delete window.confirmAction;
            };
        }

        function showAlert(message, type) {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            `;

            const alertBox = document.createElement('div');
            const borderColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#4ECDC4';
            alertBox.style.cssText = `
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-width: 500px;
                text-align: center;
                border-left: 5px solid ${borderColor};
            `;

            alertBox.innerHTML = `
                <div style="margin: 0 0 20px 0; font-size: 16px; color: #333; line-height: 1.5;">${message}</div>
                <button onclick="this.closest('.alert-overlay').remove()" 
                        style="background: #4ECDC4; color: white; border: none; padding: 10px 20px; 
                               border-radius: 5px; cursor: pointer; font-weight: bold;">OK</button>
            `;

            overlay.className = 'alert-overlay';
            overlay.appendChild(alertBox);
            document.body.appendChild(overlay);

            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                }
            }, 5000);
        }
    

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9928d6aa14694ee8',t:'MTc2MTEzNDQ3MS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();