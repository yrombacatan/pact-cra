import React from 'react';
import { NavLink } from 'react-router-dom';

import ConnectButton from '../components/ConnectButton';

/* This example requires Tailwind CSS v2.0+ */
import { Popover } from '@headlessui/react'

const Nav = () => {
  return (
      <nav className='bg-indigo-500 text-white'>
          <ul className='flex gap-8 p-5'>
              <NavLink to="/" className="hover:text-gray-200">Home</NavLink>
              <NavLink to="/users" className="hover:text-gray-200">Users</NavLink>
              <NavLink to="/methods" className="hover:text-gray-200">Methods</NavLink>
          </ul>
      </nav>
  );
};

const NavUI = () => {
  return (
    <Popover className="relative bg-white">
      <div className="lg:w-4/5 mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="#">
              <span className="sr-only">Workflow</span>
              <img
                className="h-8 w-auto sm:h-10"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt=""
              />
            </a>
          </div>

          <Popover.Group as="nav" className="hidden md:flex md:items-center space-x-10">
            <NavLink to="/methods" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Methods
            </NavLink>
            <NavLink to="/keypair" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Generate Keypairs
            </NavLink>
            <NavLink to="/contract" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Smart Contract
            </NavLink>
            <ConnectButton />
          </Popover.Group>
        </div>
      </div>
    </Popover>
  )
}

export { Nav, NavUI }