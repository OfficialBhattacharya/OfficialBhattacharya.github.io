/**
 * CSV Update Utility
 * This script helps export queued updates from localStorage to update CSV files
 * Run this in browser console on your analytics page to see pending updates
 */

function exportCSVUpdates() {
    console.log('=== CSV UPDATE EXPORT ===\n');
    
    // Export newsletter updates
    const newsletterUpdates = JSON.parse(localStorage.getItem('csv_updates_newsletter') || '[]');
    if (newsletterUpdates.length > 0) {
        console.log('📧 NEWSLETTER SUBSCRIBERS TO ADD:');
        console.log('Copy this data and append to newsletter_subscribers.csv:\n');
        
        newsletterUpdates.forEach(update => {
            const csvLine = `${update.email},${update.timestamp},${update.source},${update.status},${update.country}`;
            console.log(csvLine);
        });
        console.log(`\nTotal new subscribers: ${newsletterUpdates.length}\n`);
    }
    
    // Export visitor updates
    const visitorUpdates = JSON.parse(localStorage.getItem('csv_updates_visitors') || '[]');
    if (visitorUpdates.length > 0) {
        console.log('👥 VISITOR DATA TO ADD:');
        console.log('Process this data to update visitor_stats.csv and other files:\n');
        console.log(JSON.stringify(visitorUpdates, null, 2));
        console.log(`\nTotal new visitor records: ${visitorUpdates.length}\n`);
    }
    
    // Export current stats for daily update
    const currentDate = new Date().toISOString().split('T')[0];
    const totalVisitors = JSON.parse(localStorage.getItem('site_visits') || '[]').length;
    const uniqueVisitors = new Set(
        JSON.parse(localStorage.getItem('site_visits') || '[]').map(v => v.visitorId)
    ).size;
    const subscriberCount = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]').length;
    
    console.log('📊 DAILY STATS UPDATE:');
    console.log('Add this line to visitor_stats.csv:\n');
    console.log(`${currentDate},${totalVisitors},${uniqueVisitors},${Math.min(totalVisitors, 30)},${subscriberCount}`);
    console.log('\n');
    
    // Show geographic distribution
    const visits = JSON.parse(localStorage.getItem('site_visits') || '[]');
    const locationCounts = {};
    visits.forEach(visit => {
        if (visit.location && visit.location.country) {
            const country = visit.location.country;
            locationCounts[country] = (locationCounts[country] || 0) + 1;
        }
    });
    
    if (Object.keys(locationCounts).length > 0) {
        console.log('🌍 GEOGRAPHIC DATA UPDATE:');
        console.log('Current visitor distribution:\n');
        Object.entries(locationCounts)
            .sort(([,a], [,b]) => b - a)
            .forEach(([country, count]) => {
                const percentage = ((count / totalVisitors) * 100).toFixed(1);
                console.log(`${country}: ${count} visits (${percentage}%)`);
            });
        console.log('\n');
    }
    
    console.log('=== END EXPORT ===');
    console.log('\n📝 INSTRUCTIONS:');
    console.log('1. Copy the data above');
    console.log('2. Update the corresponding CSV files');
    console.log('3. Run clearCSVUpdates() to clear the queue');
    console.log('4. Refresh the page to see updated data');
}

function clearCSVUpdates() {
    localStorage.removeItem('csv_updates_newsletter');
    localStorage.removeItem('csv_updates_visitors');
    console.log('✅ CSV update queue cleared');
}

function showCurrentStats() {
    console.log('=== CURRENT STATS ===');
    console.log('Total visits:', JSON.parse(localStorage.getItem('site_visits') || '[]').length);
    console.log('Newsletter subscribers:', JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]').length);
    console.log('Unique visitors:', new Set(JSON.parse(localStorage.getItem('site_visits') || '[]').map(v => v.visitorId)).size);
    
    const updates = {
        newsletter: JSON.parse(localStorage.getItem('csv_updates_newsletter') || '[]').length,
        visitors: JSON.parse(localStorage.getItem('csv_updates_visitors') || '[]').length
    };
    console.log('Pending updates:', updates);
}

// Auto-run instructions
console.log('📊 CSV Management Utility Loaded');
console.log('Available commands:');
console.log('- exportCSVUpdates() - Export pending updates');
console.log('- clearCSVUpdates() - Clear update queue');
console.log('- showCurrentStats() - Show current statistics'); 