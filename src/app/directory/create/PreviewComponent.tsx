'use client';

import React from 'react';

type Officer = {
  id?: string;
  name: string;
  position?: string;
  president?: boolean;
  locked?: boolean;
};

type Contact = {
  platform: string;
  url?: string;
};

type CreateClubSchema = {
  name?: string;
  description?: string;
  officers?: Officer[];
  contacts?: Contact[];
};

type PreviewComponentProps = {
  formData: CreateClubSchema;
};

const PreviewComponent = ({ formData }: PreviewComponentProps) => {
  const contacts = formData.contacts || [];
  const officers = formData.officers || [];

  return (
    <div className="rounded-lg bg-white shadow-lg overflow-hidden border border-gray-200">
      <div
        className="relative h-48 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-between px-8"
        style={{
          backgroundImage:
            'linear-gradient(to bottom right, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95)), url("data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200h100v100H0z%22%20fill%3D%22%23000%22%20fill-opacity%3D%220.05%22/%3E%3C/svg%3E")',
          backgroundSize: 'cover, 20px 20px',
        }}
      >
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          {formData.name || 'Organization Name'}
        </h1>
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-lg"
        >
          Join
        </button>
      </div>

      <div className="p-8 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
              <p className="text-gray-700 leading-relaxed">
                {formData.description || 'No description provided'}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
              <p className="text-gray-600">There are no upcoming events</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Name</span>
                  <span className="text-gray-900 text-right">
                    {formData.name || 'Not provided'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Description</span>
                  <span className="text-gray-900 text-right">
                    {formData.description || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>

            {officers.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Officers</h3>
                <ul className="space-y-2">
                  {officers.map((officer, index) => (
                    <li key={officer.id || index} className="text-gray-700">
                      <span className="font-semibold">{officer.name}</span>
                      {officer.position && (
                        <span className="text-gray-600"> - {officer.position}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {contacts.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Contacts</h3>
                <ul className="space-y-2">
                  {contacts.map((contact, index) => (
                    <li key={index} className="text-gray-700">
                      <span className="font-semibold">{contact.platform}</span>
                      {contact.url && (
                        <a
                          href={contact.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 ml-2 text-sm break-all"
                        >
                          {contact.url}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewComponent;