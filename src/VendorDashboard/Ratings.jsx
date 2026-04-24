import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import api from "../utils/axios";
import toast from 'react-hot-toast';

function StarRow({ label, score }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(score / 10) * 100}%` }} />
        </div>
        <span className="text-sm font-600 text-slate-700 w-8 text-right">{score}</span>
      </div>
    </div>
  );
}

function RatingCard({ rating }) {
  const date = new Date(rating.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-600 text-slate-800">{rating.ratedBy?.name || 'Admin'}</p>
          <p className="text-xs text-slate-400 mt-0.5">{date} {rating.period ? `· ${rating.period}` : ''}</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-sm font-700 text-amber-700">{rating.overallScore}/10</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <StarRow label="Quality"        score={rating.qualityScore} />
        <StarRow label="Delivery"       score={rating.deliveryScore} />
        <StarRow label="Cost Efficiency" score={rating.costEfficiencyScore} />
        <StarRow label="Compliance"     score={rating.complianceScore} />
      </div>

      {rating.feedback && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-500 uppercase tracking-wide mb-1">Feedback</p>
          <p className="text-sm text-slate-600">{rating.feedback}</p>
        </div>
      )}
    </div>
  );
}

export default function VendorRatings() {
  const [data, setData]     = useState({ ratings: [], averageScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vendor/ratings')
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load ratings'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-48"><div className="w-7 h-7 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Ratings & Feedback</h1>
        <p className="page-subtitle">{data.ratings.length} performance evaluation{data.ratings.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Score summary */}
      <div className="card p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center">
          <div className="text-5xl font-800 text-slate-900">{data.averageScore}</div>
          <div className="text-xs text-slate-400 mt-1 font-500">out of 10</div>
          <div className="flex items-center gap-1 justify-center mt-2">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className={`w-4 h-4 ${i <= Math.round(data.averageScore / 2) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
            ))}
          </div>
        </div>
        <div className="flex-1 w-full space-y-2">
          <StarRow label="Average Quality"        score={data.ratings.length ? parseFloat((data.ratings.reduce((s,r) => s + r.qualityScore, 0) / data.ratings.length).toFixed(1)) : 0} />
          <StarRow label="Average Delivery"       score={data.ratings.length ? parseFloat((data.ratings.reduce((s,r) => s + r.deliveryScore, 0) / data.ratings.length).toFixed(1)) : 0} />
          <StarRow label="Average Cost Efficiency" score={data.ratings.length ? parseFloat((data.ratings.reduce((s,r) => s + r.costEfficiencyScore, 0) / data.ratings.length).toFixed(1)) : 0} />
          <StarRow label="Average Compliance"     score={data.ratings.length ? parseFloat((data.ratings.reduce((s,r) => s + r.complianceScore, 0) / data.ratings.length).toFixed(1)) : 0} />
        </div>
      </div>

      {data.ratings.length === 0 ? (
        <div className="card p-12 text-center">
          <Star className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No ratings received yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.ratings.map(r => <RatingCard key={r._id} rating={r} />)}
        </div>
      )}
    </div>
  );
}