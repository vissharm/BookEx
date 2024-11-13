const React = require('react');
import DashIcon from '../components/DashIcon';

const Dashboard = () => {
    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div class="dashboard-title card-panel teal lighten-2" style={{width: '50%', backgroundColor: 'skyblue !important', fontFamily: 'math'}}><h1>BookEx - Book Exchange Platform</h1></div>
            </div>
            <div className='row dash-card-wrapper'>
                <div className="col s3 dash-icon-wrapper">
                    <DashIcon />
                </div>
                <div class="col s5 dash-card">
                    <div class="col s12 m5 dash-card-child">
                        <div class="card-panel red accent-1">
                            <span class="">A Book Exchange Platform is a digital space where book lovers can connect, share, and trade books. It's a sustainable and eco-friendly way to discover new reads and reduce your carbon footprint.
                            </span>
                            <p>
                                Benefits of Using a Book Exchange Platform:
                                <div className='p-l-5'>
                                    <ul className='list'>
                                        <li className='list'>Sustainability: Reduce waste by giving books a second life.</li>
                                        <li className='list'>Affordability: Access a wide range of books without spending money.</li>
                                        <li className='list'>Community: Connect with like-minded book lovers and build a strong community.</li>
                                        <li className='list'>Discovery: Discover new authors and genres.</li>
                                        <li className='list'>Convenience: Easily trade books from the comfort of your home.</li>
                                    </ul>
                                </div>
                                <span class="">By joining a book exchange platform, you can contribute to a more sustainable future, enrich your reading experience, and make new friends.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;








