import { Announcement } from './types';

const AnnouncementTable = ({ data }: { data: Announcement[] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
     
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 whitespace-nowrap">Title</th>
              <th className="px-6 py-4 whitespace-nowrap">Audience</th>
              <th className="px-6 py-4 whitespace-nowrap">Channel</th>
              <th className="px-6 py-4 whitespace-nowrap">Status</th>
              <th className="px-6 py-4 whitespace-nowrap">Created By</th>
              <th className="px-6 py-4 whitespace-nowrap">Date</th>
              <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-indigo-900 whitespace-nowrap">
                  {item.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-md bg-indigo-50 text-indigo-600 font-medium">
                    {item.audience}
                  </span>
                </td>
                
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"></td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"></td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"></td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"></td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnnouncementTable;