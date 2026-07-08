import React from 'react';
import { Layout } from '../components/Layout';
import { useQueue } from '../QueueContext';
import { PriorityBadge } from '../components/PriorityBadge';

export function DisplayScreenPage() {
  const { currentlyServing, waitingItems, doneItems } = useQueue();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Queue Display</h1>
          <p className="text-gray-500">Live queue status \u2014 Now serving</p>
        </div>

        {/* Currently serving - large display */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 mb-8 text-center">
          {currentlyServing ? (
            <>
              <p className="text-gray-400 text-lg mb-2">Now Serving</p>
              <p className="text-8xl font-bold text-sky-600 mb-4">{currentlyServing.number}</p>
              <div className="flex items-center justify-center gap-3">
                <PriorityBadge type={currentlyServing.type} size="lg" />
                <span className="text-gray-600 text-lg">{currentlyServing.name}</span>
              </div>
            </>
          ) : (
            <div className="py-8">
              <p className="text-gray-400 text-2xl font-medium">No one being served</p>
              <p className="text-gray-300 text-sm mt-2">Waiting for the next customer...</p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Waiting list */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Waiting ({waitingItems.length})</h2>
            </div>
            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {waitingItems.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No one waiting</p>
              ) : (
                waitingItems.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50">
                    <span className="text-gray-400 text-sm font-mono w-6">#{idx + 1}</span>
                    <span className="font-bold text-gray-900 text-lg">{item.number}</span>
                    <span className="text-gray-600 flex-1">{item.name}</span>
                    <PriorityBadge type={item.type} size="sm" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recently served */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Recently Served</h2>
            </div>
            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {doneItems.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No one served yet</p>
              ) : (
                doneItems.slice(0, 10).map(item => (
                  <div key={item.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50">
                    <span className="font-bold text-gray-900">{item.number}</span>
                    <span className="text-gray-600 flex-1">{item.name}</span>
                    <span className="text-green-600 text-sm font-medium">Completed</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
